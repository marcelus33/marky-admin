import React from "react";
import { Formik, Form } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormLabel,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import CancelButton from "../../../components/CancelButton";
import colors from "../../../themes/utils/colors";
import XButton from "../../../components/XButton";
import BackButton from "../../../components/BackButton";

const DescriptionModal = ({
  open,
  onBack,
  onClose,
  initialDescription,
  onSubmit,
}: {
  open: boolean;
  onBack?: () => void;
  onClose: () => void;
  initialDescription: string;
  onSubmit: (description: string) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
    >
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
          <DialogTitle>Descripción del comercio</DialogTitle>
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

      <Formik
        initialValues={{ description: initialDescription || "" }}
        validationSchema={Yup.object({
          description: Yup.string()
            .max(100, "La descripción no puede superar los 100 caracteres")
            .required("La descripción es obligatoria"),
        })}
        onSubmit={(values) => {
          onSubmit(values.description);
          onClose();
        }}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          isValid,
          dirty,
          isSubmitting,
        }) => (
          <Form
            style={
              isMobile
                ? { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }
                : undefined
            }
          >
            <DialogContent
              sx={
                isMobile
                  ? { flex: 1, overflowY: "auto" }
                  : { maxHeight: "80vh" }
              }
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <FormLabel>Descripción</FormLabel>
                <Typography>
                  {values.description?.length || 0}/100
                </Typography>
              </Box>
              <TextField
                sx={{ mt: 2 }}
                name="description"
                placeholder="Ej. Pastelería artesanal con café de especialidad."
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                inputProps={{ maxLength: 100 }}
              />
              <Typography
                variant="body2"
                sx={{ mt: 4, color: colors.light.grey[900] }}
              >
                Escribe una bio breve para presentar tu negocio en el perfil
                público. Máximo 100 caracteres.
              </Typography>
            </DialogContent>
            <DialogActions
              sx={{
                borderTop: "1px solid lightgrey",
                display: "flex",
                gap: 2,
                padding: 4,
                flexShrink: 0,
                ...(isMobile && { "& > button": { flex: 1 } }),
              }}
            >
              <CancelButton sx={{ paddingX: 4 }} onClick={onClose}>
                Cancelar
              </CancelButton>
              <Button
                disabled={!isValid || !dirty}
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

export default DescriptionModal;
