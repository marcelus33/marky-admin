import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Field, Form, Formik, useFormikContext } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import BusinessTypeSelectorField from "../../components/BusinessTypeSelectorField";
import CategorySelectionList from "../../components/CategorySelectionList";
import FormikPhoneInput from "../../components/FormikPhoneInput";
import { Header } from "../../components/Header";
import Input from "../../components/Input";
import CustomModal from "../../components/Modal";
import NumberInput from "../../components/NumberInput";
import { useBusinessAccountInfo } from "../../hooks/useBusinessAccountInfo";
import { useUpdateBusinessAccountInfo } from "../../hooks/useBusinessMutations";
import { useCategories } from "../../hooks/useCategories";
import { useCities } from "../../hooks/useCities";
import { useCountries } from "../../hooks/useCountries";
import { useCurrencies } from "../../hooks/useCurrencies";
import { displayFormikFormErrors } from "../../utils/utils";

const SettingsCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  onEdit?: () => void;
  children?: React.ReactNode;
  paperSx?: object;
}> = ({ title, icon, onEdit, children, paperSx }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "12px",
        pt: 4,
        pb: 6,
        px: 6,
        mb: "25px",
        bgcolor: "white",
        border: "1px solid #EDEDED",
        ...paperSx,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
        {onEdit && (
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{ bgcolor: "#EDEDED", borderRadius: "6px", p: 2 }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
      <Box mt={2}>{children}</Box>
    </Paper>
  );
};

const FieldDisplay: React.FC<{
  label: string;
  value?: React.ReactNode;
  sx?: object;
}> = ({ label, value, sx }) => (
  <Box sx={sx}>
    <Typography
      sx={{ fontSize: 14, fontWeight: 700, color: "#4b4b4b", mb: 0.5 }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        backgroundColor: "#FAFAFA",
        borderRadius: "6px",
        py: 1.5,
        px: 3,
        minHeight: 48,
        display: "flex",
        alignItems: "center",
      }}
    >
      {value ?? "-"}
    </Box>
  </Box>
);

type LocationFormValues = {
  country: string;
  city: string;
};

const LocationFormFields: React.FC<{
  countries?: any[];
  currentCityLabel: string;
  onCancel: () => void;
}> = ({ countries, currentCityLabel, onCancel }) => {
  const { values, setFieldValue, isSubmitting } =
    useFormikContext<LocationFormValues>();
  const { cities, isLoading: isLoadingCities } = useCities(
    values.country || null,
  );

  const hasSelectedCityInOptions = (cities || []).some(
    (c: any) => String(c.id) === String(values.city),
  );

  return (
    <Form>
      <TextField
        select
        fullWidth
        label="País"
        value={values.country}
        onChange={(e) => {
          const nextCountryId = e.target.value;
          if (nextCountryId === values.country) return;
          setFieldValue("country", nextCountryId);
          setFieldValue("city", "");
        }}
        margin="normal"
        sx={(theme) => ({
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.grey[100],
          },
        })}
      >
        {(countries || []).map((c: any) => (
          <MenuItem key={c.id} value={String(c.id)}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Ciudad"
        value={values.city}
        onChange={(e) => setFieldValue("city", e.target.value)}
        margin="normal"
        disabled={!values.country || isLoadingCities}
        sx={(theme) => ({
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.grey[100],
          },
        })}
      >
        {isLoadingCities && values.country ? (
          <MenuItem value="">Cargando ciudades...</MenuItem>
        ) : (
          (cities || []).map((c: any) => (
            <MenuItem key={c.id} value={String(c.id)}>
              {c.name}
            </MenuItem>
          ))
        )}

        {!isLoadingCities &&
          values.city &&
          !hasSelectedCityInOptions &&
          currentCityLabel && (
            <MenuItem value={values.city}>{currentCityLabel}</MenuItem>
          )}
      </TextField>

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ paddingX: 4 }}
        >
          Guardar
        </Button>
      </Box>
    </Form>
  );
};

const sidebarNavItemSx = {
  borderRadius: 2,
  mb: 1,
  "&.Mui-selected": {
    backgroundColor: "#F9F9F9",
    boxShadow: "inset -4px 0 0 0 #347AEA",
    "&:hover": { backgroundColor: "#F9F9F9" },
  },
};

const AccountConfigurationPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedSection, setSelectedSection] = useState<
    "configuration" | "security"
  >("configuration");

  const { data, isLoading } = useBusinessAccountInfo();
  const updateAccountInfo = useUpdateBusinessAccountInfo();

  const { categories: allCategories } = useCategories();
  const { countries } = useCountries();
  const { currencies } = useCurrencies();

  const [openModal, setOpenModal] = useState<
    | null
    | "id"
    | "categories"
    | "location"
    | "business_type"
    | "money"
    | "access"
  >(null);
  const exchangeFromCode = data?.is_primary_to_secondary
    ? data?.primary_currency_code
    : data?.secondary_currency_code;
  const exchangeToCode = data?.is_primary_to_secondary
    ? data?.secondary_currency_code
    : data?.primary_currency_code;

  return (
    <Box>
      <Header />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        {!isMobile && (
          <Box
            sx={{
              width: 280,
              p: 4,
              borderRight: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
            >
              <Avatar sx={{ width: 110, height: 110, mb: 2 }} />
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography
                  sx={{ fontSize: 18, fontWeight: 500, color: "#4b4b4b" }}
                >
                  {data?.business_name ?? "Nombre del Comercio"}
                </Typography>
                <VerifiedIcon sx={{ fontSize: 16, color: "#337AEA" }} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Usuario
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 14, fontWeight: 500, color: "#9E9EA6", mb: 1 }}
            >
              Tu cuenta
            </Typography>
            <List>
              <ListItemButton
                selected={selectedSection === "configuration"}
                onClick={() => setSelectedSection("configuration")}
                sx={sidebarNavItemSx}
              >
                <ListItemIcon>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Configuración" />
              </ListItemButton>
              <ListItemButton
                selected={selectedSection === "security"}
                onClick={() => setSelectedSection("security")}
                sx={sidebarNavItemSx}
              >
                <ListItemIcon>
                  <LockOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Seguridad" />
              </ListItemButton>
              {/* <ListItemButton sx={sidebarNavItemSx}>
                <ListItemIcon>
                  <CardMembershipOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Subscripción" />
              </ListItemButton>
              <ListItemButton sx={sidebarNavItemSx}>
                <ListItemIcon>
                  <ReceiptLongOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Facturación" />
              </ListItemButton> */}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography
              sx={{ fontSize: 14, fontWeight: 500, color: "#9E9EA6", mb: 1 }}
            >
              Ayuda
            </Typography>
            <List>
              <ListItemButton sx={sidebarNavItemSx}>
                <ListItemIcon>
                  <WhatsAppIcon />
                </ListItemIcon>
                <ListItemText primary="Atención al cliente" />
              </ListItemButton>
            </List>
          </Box>
        )}

        <Box sx={{ flex: 1, p: { xs: 2, md: 6 } }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 28,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: "#000",
                }}
              >
                {selectedSection === "configuration"
                  ? "Configuración"
                  : "Seguridad"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 16,
                  color: "#7C8DB5",
                  lineHeight: 1.5,
                }}
              >
                @{data?.business_id ?? "nombre_empresa"}
              </Typography>
            </Box>
            <Paper
              elevation={0}
              sx={{
                boxShadow: "0px 2px 5px rgba(124,141,181,0.12)",
                borderRadius: "8px",
                px: 3,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 14, color: "#4b4b4b" }}>
                Creada el 17/07/2025
              </Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "#9E9EA6" }} />
            </Paper>
          </Box>

          {isLoading ? (
            <Typography>Cargando...</Typography>
          ) : selectedSection === "configuration" ? (
            <Box>
              {/* ID del comercio + QR Card */}
              <Box
                display="flex"
                gap={3}
                flexDirection={{ xs: "column", md: "row" }}
                alignItems={{ md: "flex-start" }}
              >
                <Box flex={1}>
                  <SettingsCard
                    title="ID del comercio"
                    icon={<BadgeOutlinedIcon />}
                    onEdit={() => data && setOpenModal("id")}
                  >
                    <FieldDisplay
                      label="Nombre"
                      value={data?.business_name}
                      sx={{ mb: 2.5 }}
                    />
                    <FieldDisplay
                      label="Usuario"
                      value={data?.business_id}
                      sx={{ mb: 2.5 }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#4b4b4b",
                          mb: 0.5,
                        }}
                      >
                        Tu enlace público
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Box
                          sx={{
                            flex: 1,
                            backgroundColor: "#FAFAFA",
                            borderRadius: "6px",
                            py: 1.5,
                            px: 3,
                            minHeight: 48,
                            display: "flex",
                            alignItems: "center",
                            fontSize: 14,
                            color: "#4b4b4b",
                          }}
                        >
                          marky.me/{data?.business_id ?? "..."}
                        </Box>
                        <Button
                          variant="text"
                          startIcon={<ContentCopyIcon />}
                          sx={{
                            bgcolor: "#EDEDED",
                            borderRadius: "6px",
                            px: 3,
                            color: "#4b4b4b",
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            "&:hover": { bgcolor: "#E0E0E0" },
                          }}
                        >
                          Copiar enlace
                        </Button>
                      </Box>
                    </Box>
                  </SettingsCard>
                </Box>

                {/* <Box
                  sx={{
                    width: { xs: "100%", md: 280 },
                    bgcolor: "#E8F3FF",
                    borderRadius: "12px",
                    p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mb: "25px",
                  }}
                >
                  <QrCode2Icon sx={{ fontSize: 80, color: "#337AEA" }} />
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#4b4b4b",
                      textAlign: "center",
                    }}
                  >
                    Comparte tu negocio con tus clientes
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadOutlinedIcon />}
                    sx={{ borderRadius: "8px", textTransform: "none" }}
                  >
                    Descargar QR
                  </Button>
                </Box> */}
              </Box>

              {/* Categorías */}
              <SettingsCard
                title="Categoría comercial"
                icon={<CategoryOutlinedIcon />}
                onEdit={() => setOpenModal("categories")}
              >
                {(data?.categories ?? []).length ? (
                  <Box>
                    <Typography sx={{ fontSize: 14, color: "#4b4b4b", mb: 1 }}>
                      Categoría principal de tu negocio
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#9E9EA6", mb: 2 }}>
                      Especialidad
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {data!.categories.map((c) => (
                        <Box
                          key={c.id}
                          sx={{
                            bgcolor: "#E8F3FF",
                            color: "#337AEA",
                            fontSize: 14,
                            px: 2,
                            py: 1,
                            borderRadius: "6px",
                          }}
                        >
                          {c.name}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      bgcolor: "#E8F3FF",
                      color: "#337AEA",
                      fontSize: 14,
                      px: 2,
                      py: 1,
                      borderRadius: "6px",
                      display: "inline-block",
                    }}
                  >
                    Sin categoría
                  </Box>
                )}
              </SettingsCard>

              {/* Ubicación */}
              <SettingsCard
                title="Ubicación geográfica"
                icon={<LocationOnOutlinedIcon />}
                onEdit={() => setOpenModal("location")}
              >
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  <Box flex={1}>
                    <FieldDisplay label="País" value={data?.country_name} />
                  </Box>
                  <Box flex={1}>
                    <FieldDisplay label="Ciudad" value={data?.city_name} />
                  </Box>
                </Box>
              </SettingsCard>

              {/* Tipo de negocio */}
              <SettingsCard
                title="Tipo de negocio"
                icon={<StorefrontOutlinedIcon />}
                onEdit={() => setOpenModal("business_type")}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <StorefrontOutlinedIcon sx={{ color: "#337AEA" }} />
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#337AEA",
                        fontSize: 14,
                      }}
                    >
                      {data?.business_type === "commercial"
                        ? "Comercial"
                        : data?.business_type === "entrepreneur"
                          ? "Emprendedor"
                          : data?.business_type || "Sin definir"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#9E9EA6" }}>
                      {data?.business_type === "commercial"
                        ? "Tu negocio dispone de sucursal para recibir clientes o comensales"
                        : data?.business_type === "entrepreneur"
                          ? "Tu negocio aun no cuenta con sucursal. Opera desde un centro de producción."
                          : ""}
                    </Typography>
                  </Box>
                </Box>
              </SettingsCard>

              {/* Expresión monetaria */}
              <SettingsCard
                title="Expresión monetaria"
                icon={<AttachMoneyOutlinedIcon />}
                onEdit={() => setOpenModal("money")}
              >
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  <Box flex={1}>
                    <FieldDisplay
                      label="Moneda de uso"
                      value={
                        data?.primary_currency_code
                          ? `${data.primary_currency_code} - ${data.primary_currency_name}`
                          : undefined
                      }
                    />
                  </Box>
                  <Box flex={1}>
                    <FieldDisplay
                      label="Moneda secundaria"
                      value={
                        data?.secondary_currency_code
                          ? `${data.secondary_currency_code} - ${data.secondary_currency_name}`
                          : undefined
                      }
                    />
                  </Box>
                </Box>
                <Box mt={2}>
                  <Typography variant="body2">
                    Precios con tasa de cambio
                  </Typography>
                  <Typography variant="caption">
                    Se mostrará el valor de cambio en tus productos.
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={2}>
                    <Box
                      sx={{
                        backgroundColor: "#FFF4E8",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                      }}
                    >{`1 ${exchangeFromCode ?? ""}`}</Box>
                    <Box>es igual a:</Box>
                    <Box
                      sx={{
                        backgroundColor: "#FFF4E8",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                      }}
                    >{`${data?.exchange_rate} ${exchangeToCode ?? ""}`}</Box>
                    <IconButton
                      sx={{ bgcolor: "#EDEDED", borderRadius: "6px", p: 2 }}
                    >
                      <CachedIcon />
                    </IconButton>
                  </Box>
                </Box>
              </SettingsCard>
            </Box>
          ) : (
            // Security section
            <Box>
              <SettingsCard
                title="Datos de acceso"
                icon={<MailOutlineIcon />}
                onEdit={() => setOpenModal("access")}
              >
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  <Box flex={1}>
                    <FieldDisplay label="Email" value={data?.email} />
                  </Box>
                  <Box flex={1}>
                    <FieldDisplay label="Teléfono" value={data?.phone_number} />
                  </Box>
                </Box>
              </SettingsCard>
            </Box>
          )}
        </Box>
      </Box>

      {/* MODALS */}
      <CustomModal
        open={openModal === "id"}
        onClose={() => setOpenModal(null)}
        title="Editar identidad del comercio"
        sx={{ width: 520 }}
        hideFooter
      >
        {!data ? (
          <Box p={4}>
            <Typography>Cargando...</Typography>
          </Box>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{
              business_name: data.business_name ?? "",
              business_id: data.business_id ?? "",
            }}
            validationSchema={Yup.object({
              business_name: Yup.string().required("Requerido"),
              business_id: Yup.string()
                .required("Requerido")
                .matches(/^[a-z0-9\-_]+$/, "Solo minúsculas, - y _")
                .min(4)
                .max(22),
            })}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              try {
                setSubmitting(true);
                await updateAccountInfo.mutateAsync({
                  business_name: values.business_name,
                  business_id: values.business_id,
                });
                setOpenModal(null);
              } catch (err: any) {
                displayFormikFormErrors(err, setFieldError);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  name="business_name"
                  component={Input}
                  label="Nombre del comercio"
                />
                <Field
                  name="business_id"
                  component={Input}
                  label="Usuario (slug)"
                />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                  <Button onClick={() => setOpenModal(null)}>Cancelar</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ paddingX: 4 }}
                  >
                    Guardar
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </CustomModal>

      <CustomModal
        open={openModal === "access"}
        onClose={() => setOpenModal(null)}
        title="Editar datos de acceso"
        sx={{ width: 520 }}
        hideFooter
      >
        <Formik
          enableReinitialize
          initialValues={{
            email: data?.email ?? "",
            phone_number: data?.phone_number ?? "",
          }}
          validationSchema={Yup.object({
            email: Yup.string().email("Email inválido").required("Requerido"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              setSubmitting(true);
              await updateAccountInfo.mutateAsync({
                email: values.email,
                phone_number: values.phone_number,
              });
              setOpenModal(null);
            } catch (err: any) {
              displayFormikFormErrors(err, setFieldError);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="email" component={Input} label="Email" />
              <Field
                name="phone_number"
                component={FormikPhoneInput}
                label="Teléfono"
              />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={() => setOpenModal(null)}>Cancelar</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ paddingX: 4 }}
                >
                  Guardar
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomModal
        open={openModal === "categories"}
        onClose={() => setOpenModal(null)}
        title="Editar categorías"
        sx={{ width: 720 }}
        hideFooter
      >
        <Formik
          enableReinitialize
          initialValues={{ categories: data?.categories ?? [] }}
          validationSchema={Yup.object({
            categories: Yup.array().min(1, "Selecciona al menos una categoría"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              setSubmitting(true);
              const ids = values.categories.map((c: any) => Number(c.id));
              await updateAccountInfo.mutateAsync({ categories: ids });
              setOpenModal(null);
            } catch (err: any) {
              displayFormikFormErrors(err, setFieldError);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            // Wrapper compatible con el uso interno de CategorySelectionList.
            // CategorySelectionList puede llamar a `setSelected` con
            // - un array (nuevo valor), o
            // - una función (prev => next) como hace un setter de useState.
            // Al usar Formik debemos soportar ambos casos y resolver la función
            // aplicándola al valor actual antes de guardar en Formik.
            const handleSelectedChange = (next: any) => {
              const current = values.categories || [];
              const nextValue =
                typeof next === "function" ? next(current) : next;
              setFieldValue("categories", nextValue);
            };

            return (
              <Form>
                <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
                  {/* @ts-ignore */}
                  <CategorySelectionList
                    categories={allCategories || []}
                    maxSelectable={3}
                    selected={values.categories || []}
                    setSelected={handleSelectedChange}
                  />
                </Box>
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                  <Button onClick={() => setOpenModal(null)}>Cancelar</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ paddingX: 4 }}
                  >
                    Guardar
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomModal>

      <CustomModal
        open={openModal === "location"}
        onClose={() => setOpenModal(null)}
        title="Editar ubicación"
        sx={{ width: 520 }}
        hideFooter
      >
        {!data ? (
          <Box p={4}>
            <Typography>Cargando...</Typography>
          </Box>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{
              country: data?.country_id ? String(data.country_id) : "",
              city: data?.city_id ? String(data.city_id) : "",
            }}
            validationSchema={Yup.object({
              city: Yup.string().required("Selecciona una ciudad"),
            })}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              try {
                setSubmitting(true);
                const cityId = values.city ? Number(values.city) : undefined;
                if (cityId) {
                  await updateAccountInfo.mutateAsync({ city: cityId });
                }
                setOpenModal(null);
              } catch (err: any) {
                displayFormikFormErrors(err, setFieldError);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {() => (
              <LocationFormFields
                countries={countries}
                currentCityLabel={data?.city_name ?? ""}
                onCancel={() => setOpenModal(null)}
              />
            )}
          </Formik>
        )}
      </CustomModal>

      <CustomModal
        open={openModal === "business_type"}
        onClose={() => setOpenModal(null)}
        title="Tipo de negocio"
        sx={{ width: 520 }}
        hideFooter
      >
        <Formik
          enableReinitialize
          initialValues={{ business_type: data?.business_type ?? "" }}
          validationSchema={Yup.object({
            business_type: Yup.string().required("Requerido"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              setSubmitting(true);
              await updateAccountInfo.mutateAsync({
                business_type: values.business_type,
              });
              setOpenModal(null);
            } catch (err: any) {
              displayFormikFormErrors(err, setFieldError);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                name="business_type"
                component={BusinessTypeSelectorField}
                options={[
                  {
                    value: "commercial",
                    label: "Comercial",
                    description:
                      "Tu negocio dispone de sucursal para recibir clientes o comensales",
                  },
                  {
                    value: "entrepreneur",
                    label: "Emprendedor",
                    description:
                      "Tu negocio aun no cuenta con sucursal. Opera desde un centro de producción.",
                  },
                ]}
              />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={() => setOpenModal(null)}>Cancelar</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ paddingX: 4 }}
                >
                  Guardar
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CustomModal>

      <CustomModal
        open={openModal === "money"}
        onClose={() => setOpenModal(null)}
        title="Expresión monetaria"
        sx={{ width: 720 }}
        hideFooter
      >
        <Formik
          enableReinitialize
          initialValues={{
            primary_currency: data?.primary_currency_id ?? "",
            secondary_currency: data?.secondary_currency_id ?? "",
            exchange_rate: data?.exchange_rate ?? "",
            is_primary_to_secondary: data?.is_primary_to_secondary ?? true,
            enable_exchange_rate: Boolean(data?.secondary_currency_id),
          }}
          validationSchema={Yup.object({
            primary_currency: Yup.string().required("Requerido"),
          })}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              setSubmitting(true);
              const payload: any = {
                primary_currency: values.primary_currency
                  ? Number(values.primary_currency)
                  : undefined,
                is_primary_to_secondary: values.is_primary_to_secondary,
              };
              if (values.enable_exchange_rate) {
                payload.secondary_currency = values.secondary_currency
                  ? Number(values.secondary_currency)
                  : null;
                payload.exchange_rate = values.exchange_rate || null;
              } else {
                payload.secondary_currency = null;
                payload.exchange_rate = null;
              }
              await updateAccountInfo.mutateAsync(payload);
              setOpenModal(null);
            } catch (err: any) {
              displayFormikFormErrors(err, setFieldError);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            const primaryCurrencyObj = (currencies || []).find(
              (c: any) => String(c.id) === String(values.primary_currency),
            );
            const secondaryCurrencyObj = (currencies || []).find(
              (c: any) => String(c.id) === String(values.secondary_currency),
            );

            const fromCode = values.is_primary_to_secondary
              ? primaryCurrencyObj?.code
              : secondaryCurrencyObj?.code;
            const toCode = values.is_primary_to_secondary
              ? secondaryCurrencyObj?.code
              : primaryCurrencyObj?.code;

            return (
              <Form>
                <TextField
                  select
                  fullWidth
                  label="Moneda principal"
                  value={values.primary_currency}
                  onChange={(e) => {
                    const next = e.target.value;
                    // if secondary equals new primary, clear secondary and rate
                    if (String(values.secondary_currency) === String(next)) {
                      setFieldValue("secondary_currency", "");
                      setFieldValue("exchange_rate", "");
                    }
                    setFieldValue("primary_currency", next);
                  }}
                  margin="normal"
                  sx={(t) => ({
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: t.palette.grey[100],
                    },
                  })}
                >
                  {(currencies || []).map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.enable_exchange_rate}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue("enable_exchange_rate", checked);
                        if (!checked) {
                          setFieldValue("secondary_currency", "");
                          setFieldValue("exchange_rate", "");
                        }
                      }}
                    />
                  }
                  label="Precios con tasa de cambio"
                />
                {values.enable_exchange_rate && (
                  <>
                    <TextField
                      select
                      fullWidth
                      label="Moneda secundaria"
                      value={values.secondary_currency}
                      onChange={(e) =>
                        setFieldValue("secondary_currency", e.target.value)
                      }
                      margin="normal"
                      sx={(t) => ({
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: t.palette.grey[100],
                        },
                      })}
                    >
                      {(currencies || [])
                        .filter(
                          (curr: any) =>
                            String(curr.id) !== String(values.primary_currency),
                        )
                        .map((c: any) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.code} - {c.name}
                          </MenuItem>
                        ))}
                    </TextField>

                    {values.secondary_currency && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={(t) => ({
                              width: "15%",
                              backgroundColor: t.palette.grey[300],
                              paddingX: 2,
                              paddingY: 1,
                              borderRadius: 2,
                              textAlign: "center",
                            })}
                          >
                            <Typography id="modal-description" variant="body2">
                              {fromCode ? `1 ${fromCode}` : ""}
                            </Typography>
                          </Box>

                          <Box sx={{ width: "20%" }}>
                            <Typography id="modal-description" variant="body2">
                              es igual a:
                            </Typography>
                          </Box>

                          <Field
                            component={NumberInput}
                            name="exchange_rate"
                            label="Tasa de cambio"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography variant="body2">
                                    {toCode ?? ""}
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
                          />

                          <Button
                            variant="outlined"
                            sx={{
                              border: 0,
                              backgroundColor: theme.palette.grey[300],
                              mt: 4,
                            }}
                            onClick={() => {
                              setFieldValue(
                                "is_primary_to_secondary",
                                !values.is_primary_to_secondary,
                              );
                              setFieldValue("exchange_rate", "");
                            }}
                          >
                            <CachedIcon color="action" />
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </>
                )}
                <Box
                  mt={4}
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                  pt={4}
                >
                  <Button onClick={() => setOpenModal(null)}>Cancelar</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ paddingX: 4 }}
                  >
                    Guardar
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomModal>
    </Box>
  );
};

export default AccountConfigurationPage;
