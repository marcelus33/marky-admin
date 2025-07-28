import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import CancelButton from "../../../components/CancelButton";
import XButton from "../../../components/XButton";
import BackButton from "../../../components/BackButton";

const channelOptions = [
  {
    value: "instagram",
    label: "Instagram",
    icon: <InstagramIcon fontSize="large" sx={{ mr: 1 }} />,
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: <FacebookIcon fontSize="large" sx={{ mr: 1 }} />,
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: <WhatsAppIcon fontSize="large" sx={{ mr: 1 }} />,
  },
  {
    value: "website",
    label: "Website",
    icon: <LanguageIcon fontSize="large" sx={{ mr: 1 }} />,
  },
];

const validationSchema = Yup.object({
  channels: Yup.array()
    .of(
      Yup.object({
        type: Yup.string().required("Selecciona un canal"),
        url: Yup.string().url("URL inválida").required("Ingresa la URL"),
      })
    )
    .max(4, "Máximo 4 canales"),
});

const ChannelsModal = ({
  open,
  onClose,
  initialChannels,
  onSubmit,
  onBack,
}: {
  open: boolean;
  onBack?: () => void;
  onClose: () => void;
  initialChannels: { type: string; url: string }[];
  onSubmit: (channels: { type: string; url: string }[]) => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      >
        <Box display={"flex"}>
          {onBack && (
            <Box display={"flex"} sx={{ paddingY: 3 }}>
              <BackButton onClick={onBack} sx={{ marginLeft: 2 }} />
            </Box>
          )}
          <DialogTitle>Canales</DialogTitle>
        </Box>
        <Box display={"flex"} sx={{ paddingY: 3 }}>
          <XButton onClick={onClose} sx={{ marginRight: 2 }} />
        </Box>
      </Box>
      {/*  */}
      <Formik
        initialValues={{ channels: initialChannels }}
        validationSchema={validationSchema}
        // enableReinitialize={true}
        validateOnMount
        onSubmit={(values) => {
          onSubmit(values.channels);
          onClose();
        }}
      >
        {({ values, errors, touched, handleChange, isValid }) => (
          <Form>
            <DialogContent sx={{ maxHeight: "80vh" }}>
              <FieldArray name="channels">
                {({ push, remove }) => (
                  <Box>
                    <Box display="flex" gap={2} mb={1} alignItems="center">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Canal
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          URL
                        </Typography>
                      </Box>
                      {/* Espacio para el icono de eliminar (vacío) */}
                      <Box sx={{ width: 40 }} />
                    </Box>

                    {values.channels.map((channel, index) => {
                      const isLast = index === values.channels.length - 1;
                      return (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          mb={2}
                          sx={
                            !isLast
                              ? {
                                  borderBottom: "1px solid #e0e0e0",
                                  pb: 4,
                                  pt: 2,
                                }
                              : { pb: 2, pt: 2 }
                          }
                        >
                          <TextField
                            inputProps={{
                              sx: {
                                paddingX: 3,
                                paddingY: channel.type ? 2 : 4,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              },
                            }}
                            fullWidth
                            SelectProps={{ displayEmpty: true }}
                            select
                            name={`channels[${index}].type`}
                            placeholder="Seleccione canal"
                            variant="outlined"
                            size="small"
                            value={channel.type}
                            onChange={handleChange}
                            error={
                              touched.channels &&
                              touched.channels[index] &&
                              Boolean(
                                errors.channels &&
                                  errors.channels[index] &&
                                  (errors.channels[index] as any).type
                              )
                            }
                            helperText={
                              touched.channels &&
                              touched.channels[index] &&
                              errors.channels &&
                              errors.channels[index] &&
                              (errors.channels[index] as any).type
                            }
                          >
                            <MenuItem value="">
                              {`Selecciona un canal`}
                            </MenuItem>
                            {channelOptions
                              .filter((option) => {
                                // Obtén los tipos ya seleccionados en otros rows, excepto el actual.
                                const selectedTypesExcludingCurrent =
                                  values.channels
                                    .filter((_, i) => i !== index)
                                    .map((ch) => ch.type);
                                // Permite la opción si ya está seleccionada en el row actual o si no está en los otros.
                                return (
                                  option.value === channel.type ||
                                  !selectedTypesExcludingCurrent.includes(
                                    option.value
                                  )
                                );
                              })
                              .map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <Box>{option.icon}</Box>
                                  <Box>{option.label}</Box>
                                </MenuItem>
                              ))}
                          </TextField>
                          {/*  */}
                          <TextField
                            inputProps={{ sx: { padding: 4 } }}
                            fullWidth
                            name={`channels[${index}].url`}
                            placeholder="Ingrese dirección"
                            variant="outlined"
                            size="small"
                            value={channel.url}
                            onChange={handleChange}
                            error={
                              touched.channels &&
                              touched.channels[index] &&
                              Boolean(
                                errors.channels &&
                                  errors.channels[index] &&
                                  (errors.channels[index] as any).url
                              )
                            }
                            helperText={
                              touched.channels &&
                              touched.channels[index] &&
                              errors.channels &&
                              errors.channels[index] &&
                              (errors.channels[index] as any).url
                            }
                          />
                          {/*  */}
                          <IconButton onClick={() => remove(index)}>
                            <Typography color="textPrimary">
                              <CloseIcon />
                            </Typography>
                          </IconButton>
                        </Box>
                      );
                    })}
                    {values.channels.length < 4 && (
                      <Button
                        variant="text"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => push({ type: "", url: "" })}
                      >
                        Añadir otro canal
                      </Button>
                    )}
                  </Box>
                )}
              </FieldArray>
            </DialogContent>
            {/*  */}
            <DialogActions
              sx={{
                borderTop: "1px solid lightgrey",
                display: "flex",
                gap: 2,
                padding: 4,
              }}
            >
              <CancelButton sx={{ paddingX: 4 }} onClick={onClose}>
                Cancelar
              </CancelButton>
              <Button
                disabled={!isValid || values.channels.length < 1}
                sx={{ paddingX: 4 }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Guardar
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ChannelsModal;
