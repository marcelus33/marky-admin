import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as ResetPasswordImage } from "../assets/images/reset_password.svg";
import AuthMobileHeader from "../components/AuthMobileHeader";
import Input from "../components/Input";
import { ROUTES } from "../routes/paths";
import { changePassword } from "../services/authService";
import { ShowNotification } from "../utils/utils";
import { useNavigate, useParams } from "react-router-dom";

const NewPassword: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { uid = "", token = "" } = useParams();

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("Este campo es obligatorio"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
      .required("Este campo es obligatorio"),
  });

  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await changePassword({
        new_password: values.newPassword,
        uid: uid,
        token: token,
      });
      ShowNotification({ message: response.message, type: "success" });
      setPasswordChanged(true);
    } catch (error: any) {
      ShowNotification({ message: error.message, type: "error" });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: {
              xs: "none",
              md: "block",
              backgroundColor: theme.palette.primary.main + "1A",
            },
            paddingLeft: { md: `${theme.spacing(15)} !important` },
            paddingRight: { md: `${theme.spacing(15)} !important` },
            paddingTop: { md: `${theme.spacing(12)} !important` },
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            minHeight="100vh"
            sx={{ padding: 2 }}
          >
            <LogoMarkyBlack style={{ marginBottom: theme.spacing(6) }} />
            <Typography variant="h1" sx={{ marginBottom: theme.spacing(4) }}>
              Llegó tu momento,{" "}
              <span style={{ color: theme.palette.primary.main }}>
                protege tu cuenta.
              </span>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Asegúrate de que sea segura y fácil de recordar.
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginTop: theme.spacing(24) }}
            >
              <ResetPasswordImage />
            </Box>
          </Box>
        </Grid>
        {/*  */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            paddingTop: { md: `${theme.spacing(6)} !important` },
            paddingRight: { md: theme.spacing(9) },
          }}
        >
          <Box display={"flex"} justifyContent={"end"} width={"100%"}>
            {/* MOBILE HEADER */}
            <AuthMobileHeader />
          </Box>
          <Box
            sx={{
              width: { md: "60%", lg: "45%" },
              margin: "0 auto",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="100vh"
              padding={2}
            >
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: theme.spacing(6),
                }}
                variant="h2"
              >
                {passwordChanged ? "¡Hecho!" : "Nueva contraseña"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  width: "100%",
                  marginBottom: theme.spacing(6),
                }}
              >
                {passwordChanged
                  ? "Tu contraseña se ha actualizado correctamente."
                  : "Crea una nueva contraseña para tu cuenta en Marky."}
              </Typography>
              {!passwordChanged && (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  validateOnMount={true}
                >
                  {({
                    handleSubmit,
                    touched,
                    dirty,
                    errors,
                    values,
                    setFieldValue,
                    isValid,
                  }) => (
                    <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                      <Box marginBottom={theme.spacing(4)}>
                        <Field
                          name="newPassword"
                          component={Input}
                          label="Contraseña"
                          type="password"
                          required
                          placeholder="Ingresa tu nueva contraseña..."
                          error={
                            // touched.newPassword &&
                            dirty && Boolean(errors.newPassword)
                          }
                          helperText={
                            // touched.newPassword &&
                            dirty && errors.newPassword
                          }
                          value={values.newPassword}
                          onChange={(e: React.ChangeEvent<any>) => {
                            setFieldValue("newPassword", e.target.value);
                          }}
                        />
                      </Box>
                      <Box marginBottom={theme.spacing(4)}>
                        <Field
                          name="confirmPassword"
                          component={Input}
                          label="Confirmar contraseña"
                          type="password"
                          required
                          placeholder="Ingresa tu contraseña..."
                          error={
                            // touched.confirmPassword &&
                            dirty && Boolean(errors.confirmPassword)
                          }
                          helperText={
                            // touched.confirmPassword &&
                            dirty && errors.confirmPassword
                          }
                          value={values.confirmPassword}
                          onChange={(e: React.ChangeEvent<any>) => {
                            setFieldValue("confirmPassword", e.target.value);
                          }}
                        />
                      </Box>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!isValid}
                      >
                        Cambiar contraseña
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
              {passwordChanged && (
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Volver al login
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewPassword;
