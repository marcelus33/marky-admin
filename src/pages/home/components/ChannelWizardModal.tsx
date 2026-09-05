// src/components/ChannelWizardModal.tsx
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import "react-phone-input-2/lib/material.css";
import * as Yup from "yup";
import channelsWelcomeImage from "../../../assets/images/channels-welcome.png";
import BackButton from "../../../components/BackButton";
import CancelButton from "../../../components/CancelButton";
import FormikPhoneInput from "../../../components/FormikPhoneInput";
import Input from "../../../components/Input";
import XButton from "../../../components/XButton";
import colors from "../../../themes/utils/colors";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { updateSocialMediaLinks } from "../../../services/businessService";
import { useBusinessAccountInfo } from "../../../hooks/useBusinessAccountInfo";
import { normalizeWebsiteUrl, isValidWebsiteUrl } from "../../../utils/websiteUrl";

// --- tipos ---
export type ChannelKey = "instagram" | "facebook" | "whatsapp" | "website";

const channelsOrder = ["instagram", "facebook", "whatsapp", "website"];

export interface ChannelsFormValues {
  // selectedChannels: ChannelKey[];
  channelsData: Record<ChannelKey, string>;
}

interface ChannelData {
  type: ChannelKey;
  url: string;
}

interface ChannelWizardModalProps {
  open: boolean;
  onBack?: () => void;
  onClose: () => void;
  /** Si ya vinieran datos precargados, los pasas aquí */
  initialData?: ChannelData[];
  onSubmit?: (channels: Record<ChannelKey, string>) => void;
}

const ALL_CHANNELS: ChannelKey[] = [
  "instagram",
  "facebook",
  "whatsapp",
  "website",
];

// Prefijo de URL bloqueado por RRSS: el usuario solo escribe su usuario.
const CHANNEL_URL_PREFIXES: Partial<Record<ChannelKey, string>> = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
};

const stripChannelPrefix = (chan: ChannelKey, value: string): string => {
  if (!value) return value;
  if (chan === "website") {
    // buildChannelValue always stores websites with a scheme; strip it back
    // off so the field round-trips to the bare-domain format shown by its
    // "www.sitio.com" placeholder.
    return value.replace(/^https?:\/\//i, "");
  }
  const prefix = CHANNEL_URL_PREFIXES[chan];
  if (!prefix) return value;
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
};

const buildChannelValue = (chan: ChannelKey, value: string): string => {
  const prefix = CHANNEL_URL_PREFIXES[chan];
  if (prefix && value) {
    return value.startsWith(prefix) ? value : `${prefix}${value}`;
  }
  if (chan === "website" && value) {
    return normalizeWebsiteUrl(value);
  }
  return value;
};

export const ChannelWizardModal: React.FC<ChannelWizardModalProps> = ({
  open,
  onBack,
  onClose,
  initialData = [],
  onSubmit = () => {},
}) => {
  // Step 1: bienvenida, 2: selector, 3: admin
  const [step, setStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState<ChannelKey[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Número actual de la cuenta (no el de sesión, que puede quedar
  // desactualizado tras editarlo en Configuración de cuenta), para
  // precargar WhatsApp.
  const { data: accountInfo } = useBusinessAccountInfo();
  const currentPhone = accountInfo?.phone_number;

  // Get query client to invalidate cache
  const queryClient = useQueryClient();

  // TanStack Query mutation for updating social media links
  const updateSocialMediaMutation = useApiMutation({
    mutationFn: updateSocialMediaLinks,
    successMessage: "Canales guardados exitosamente",
    onSuccess: () => {
      // El backend reemplaza el set completo de canales en cada guardado, así
      // que se invalida (y no se reconstruye a mano) para reflejar el estado
      // real del servidor, igual que useUpdateBusiness.
      queryClient.invalidateQueries({ queryKey: ["homePageData"] });
    },
  });

  const initialDataMap = useMemo(() => {
    // Arranca con todas las claves vacías
    const m: Record<ChannelKey, string> = {
      instagram: "",
      facebook: "",
      whatsapp: "",
      website: "",
    };

    // Rellena con lo que venga en el array
    (initialData ?? []).forEach(({ type, url }) => {
      m[type] = stripChannelPrefix(type, url);
    });

    return m;
  }, [initialData]);

  // Initialize selectedChannels based on initial data and set step
  useEffect(() => {
    const hasAny = ALL_CHANNELS.some((c) => initialDataMap[c]?.trim() !== "");
    if (hasAny) {
      // Set selected channels based on initial data
      const initialSelectedChannels = ALL_CHANNELS.filter(
        (c) => initialDataMap[c]?.trim() !== ""
      );
      setSelectedChannels(initialSelectedChannels);
      setStep(3);
    }
  }, [initialDataMap]);

  // 3) Y finalmente los initialValues de Formik: si no hay un WhatsApp ya
  // configurado, se precarga con el número usado durante el registro.
  const initialValues: ChannelsFormValues = {
    channelsData: {
      ...initialDataMap,
      whatsapp: initialDataMap.whatsapp || currentPhone || "",
    },
  };

  const phoneSchema = Yup.string()
    .required("El campo WhatsApp es obligatorio")
    .test(
      "is-py-or-ve",
      "Debe ser un número válido de Paraguay (+5959XXXXXXXX) o Venezuela (+58XXXXXXXXXX)",
      (value = "") => {
        // strip out everything but digits
        const digits = value.replace(/\D/g, "");
        // Paraguay: +595 9XX XXX XXX → "5959" + 8 dígitos → total 12 dígitos
        if (/^5959\d{8}$/.test(digits)) return true;
        // Venezuela: +58 + 10 dígitos (p.ej. móvil 412 xxx xxxx)
        if (/^58\d{10}$/.test(digits)) return true;
        return false;
      }
    );

  const urlSchema = Yup.string()
    .required("El campo es obligatorio")
    .test(
      "is-valid-website",
      "Ingresa un sitio web válido. Ejemplo: www.sitio.com",
      isValidWebsiteUrl
    );

  const usernameSchema = Yup.string()
    .required("El campo es obligatorio")
    .matches(/^[^\s/]+$/, "Ingresa solo tu usuario, sin espacios ni \"/\"");

  const getValidationSchema = (selectedChannels: ChannelKey[]) => {
    // 1) first build a plain “shape” object of the fields you need
    const shape: Record<string, Yup.Schema<any>> = {};

    if (selectedChannels.includes("instagram")) {
      shape.instagram = usernameSchema;
    }
    if (selectedChannels.includes("facebook")) {
      shape.facebook = usernameSchema;
    }
    if (selectedChannels.includes("whatsapp")) {
      shape.whatsapp = phoneSchema;
    }
    if (selectedChannels.includes("website")) {
      shape.website = urlSchema;
    }

    // 2) wrap that into a Yup.object().shape(...)
    return Yup.object().shape({
      channelsData: Yup.object().shape(shape).required(),
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(selectedChannels)}
      onSubmit={async ({ channelsData }, { setSubmitting, setErrors }) => {
        try {
          // Filter out empty values, rebuild full URLs for RRSS with a fixed
          // prefix, and prepare data for the API
          const dataToSend: Record<string, string> = {};
          Object.entries(channelsData).forEach(([key, value]) => {
            if (value && value.trim() !== "") {
              dataToSend[key] = buildChannelValue(
                key as ChannelKey,
                value.trim()
              );
            }
          });

          // Call the mutation. `dataToSend` is passed to onSubmit right away
          // so the parent page updates instantly, the same way Descripción y
          // Atributos do, instead of waiting only on the cache invalidation.
          updateSocialMediaMutation.mutate(dataToSend, {
            onSuccess: () => {
              onSubmit(dataToSend as Record<ChannelKey, string>);
              onClose();
            },
          });
        } catch (err: any) {
          // Handle errors - the mutation will handle showing notifications
          console.error("Error submitting channels:", err);
        } finally {
          setSubmitting(false);
        }
      }}
      validateOnMount
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        isValid,
        dirty,
        isSubmitting,
        setFieldValue,
        validateForm,
        submitForm,
      }) => {
        return (
          <Form>
            <Dialog
              open={open}
              onClose={onClose}
              fullWidth
              maxWidth="sm"
              fullScreen={isMobile}
            >
              {/* --- TITULO DINÁMICO --- */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  borderBottom: "1px solid lightgrey",
                  flexShrink: 0,
                }}
              >
                <Box display={"flex"}>
                  {onBack && (
                    <Box display={"flex"} sx={{ paddingY: 3 }}>
                      <BackButton onClick={onBack} sx={{ marginLeft: 2 }} />
                    </Box>
                  )}
                  <DialogTitle>
                    {step === 1 && "Administrar canales"}
                    {step === 2 && "Canales"}
                    {step === 3 && "Administra tus canales"}
                  </DialogTitle>
                </Box>
                <Box display={"flex"} sx={{ paddingY: 3 }}>
                  <XButton
                    onClick={onClose}
                    sx={{
                      marginRight: 2,
                      ...(isMobile && {
                        backgroundColor: colors.light.grey[400],
                        borderRadius: "6px",
                        "&:hover": { backgroundColor: colors.light.grey[400] },
                      }),
                    }}
                  />
                </Box>
              </Box>

              <DialogContent
                sx={
                  isMobile
                    ? {
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                      }
                    : undefined
                }
              >
                {/* ====== STEP 1: WELCOME ====== */}
                {step === 1 && (
                  <Box textAlign="center" py={4}>
                    <img
                      src={channelsWelcomeImage}
                      alt="Canales de bienvenida"
                      // width={120}
                      style={{ marginBottom: 16 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Canales de tu marca
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{ color: "grey.500" }}
                    >
                      Conecta con tu audiencia y atrae tráfico a tus estrategias
                      de contenido mostrando tus redes sociales y canales de
                      contacto.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setStep(2)}
                      sx={{ paddingX: 4, boxShadow: 0, mt: 8 }}
                    >
                      Configurar canales
                    </Button>
                  </Box>
                )}
                {/* ====== STEP 2: SELECT ====== */}
                {step === 2 && (
                  <Box py={2}>
                    <Typography sx={{ marginBottom: 4, color: "grey.7 00" }}>
                      Selecciona hasta 4 canales para tu cuenta comercial
                    </Typography>
                    <Grid container spacing={2}>
                      {ALL_CHANNELS.map((chan) => {
                        const selected = selectedChannels.includes(chan);
                        const label = {
                          instagram: "Instagram",
                          facebook: "Facebook",
                          whatsapp: "WhatsApp",
                          website: "Sitio Web",
                        }[chan];
                        const IconComponent = {
                          instagram: InstagramIcon,
                          facebook: FacebookIcon,
                          whatsapp: WhatsAppIcon,
                          website: LanguageIcon,
                        }[chan];
                        return (
                          <Grid item xs={12} key={chan}>
                            <Button
                              fullWidth
                              onClick={() => {
                                const arr = [...selectedChannels];
                                const idx = arr.indexOf(chan);
                                if (idx > -1) {
                                  arr.splice(idx, 1);
                                  setFieldValue(`channelsData.${chan}`, "");
                                } else {
                                  arr.push(chan);
                                }
                                setSelectedChannels(arr);
                              }}
                              sx={{
                                paddingY: 4,
                                borderWidth: selected ? 2 : 1,
                                borderColor: selected
                                  ? "primary.main"
                                  : "grey.500",
                              }}
                              variant="outlined"
                              color="inherit"
                            >
                              <IconComponent />
                              <Typography variant="body2">{label}</Typography>
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
                {/* FINISH */}
                {step === 3 && (
                  <Box
                    py={2}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={isMobile ? { flex: 1, minHeight: 0 } : undefined}
                  >
                    {selectedChannels
                      .sort(
                        (a, b) =>
                          channelsOrder.findIndex((co) => co === a) -
                          channelsOrder.findIndex((co) => co === b)
                      )
                      .map((chan) => {
                        const labelMap: Record<ChannelKey, string> = {
                          instagram: "Instagram",
                          facebook: "Facebook",
                          whatsapp: "WhatsApp",
                          website: "Sitio Web",
                        };
                        const label = labelMap[chan]!;
                        const fieldName = `channelsData.${chan}`;
                        const fieldError =
                          (errors.channelsData?.[chan] as string) || "";
                        const fieldTouched = Boolean(
                          touched.channelsData?.[chan]
                        );

                        if (chan === "whatsapp") {
                          return (
                            <Field
                              key={chan}
                              name={fieldName}
                              component={FormikPhoneInput}
                              label={label}
                              required
                              placeholder="Ingrese su número"
                              error={fieldTouched && !!fieldError}
                              helperText={fieldTouched ? fieldError : ""}
                            />
                          );
                        }

                        const prefix = CHANNEL_URL_PREFIXES[chan];

                        return (
                          <Field
                            key={chan}
                            placeholder={
                              prefix ? "usuario" : "www.sitio.com"
                            }
                            name={fieldName}
                            value={values.channelsData[chan]}
                            onChange={(e: React.ChangeEvent<any>) => {
                              setFieldValue(fieldName, e.target.value);
                            }}
                            component={Input}
                            label={label}
                            type="text"
                            required
                            error={fieldTouched && !!fieldError}
                            helperText={fieldTouched ? fieldError : ""}
                            InputProps={
                              prefix
                                ? {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {prefix}
                                      </InputAdornment>
                                    ),
                                  }
                                : undefined
                            }
                          />
                        );
                      })}

                    {isMobile ? (
                      <Button
                        onClick={() => setStep(2)}
                        sx={{
                          mt: "auto",
                          width: "100%",
                          px: 4,
                          py: "13px",
                          border: "2px dashed",
                          borderColor: "primary.main",
                          borderRadius: "6px",
                          color: "primary.main",
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": {
                            border: "2px dashed",
                            borderColor: "primary.main",
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        Cambiar configuración
                      </Button>
                    ) : (
                      <Box textAlign="center" sx={{ mt: 2 }}>
                        <Button onClick={() => setStep(2)}>
                          Cambiar configuración
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </DialogContent>

              {step !== 1 && (
                <DialogActions
                  sx={{
                    px: 3,
                    py: 4,
                    borderTop: "1px solid lightgrey",
                    flexShrink: 0,
                    ...(isMobile && { "& > button": { flex: 1 } }),
                  }}
                >
                  {step === 2 && (
                    <CancelButton onClick={onClose} sx={{ paddingX: 4 }}>
                      Cancelar
                    </CancelButton>
                  )}

                  {step === 2 && (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ paddingX: 4, boxShadow: 0 }}
                      disabled={selectedChannels.length < 1}
                      onClick={() => {
                        setStep(3);
                        validateForm();
                      }}
                    >
                      Continuar
                    </Button>
                  )}

                  {step === 3 && (
                    <Button
                      onClick={submitForm}
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={
                        isSubmitting ||
                        !isValid ||
                        updateSocialMediaMutation.isPending
                      }
                      fullWidth
                    >
                      {updateSocialMediaMutation.isPending
                        ? "Guardando..."
                        : "Finalizar"}
                    </Button>
                  )}
                </DialogActions>
              )}
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};
