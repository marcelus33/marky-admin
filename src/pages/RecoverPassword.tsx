import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import RecoverPasswordImage from "../assets/images/password-recovery-img.png";
import AuthMobileHeader from "../components/AuthMobileHeader";
import Input from "../components/Input";
import Link from "../components/Link";
import { ROUTES } from "../routes/paths";
import SubmitButtonWithCountdown from "../components/ButtonCountdown";
import { sendPasswordRecovery } from "../services/authService";
import { ShowNotification } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const RecoverPassword: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email no válido")
      .required("Este campo es obligatorio"),
  });

  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await sendPasswordRecovery({
        email: values.email,
      });
      ShowNotification({ message: response.message, type: "success" });
      setSentEmail(values.email);
      setEmailSent(true);
    } catch (error: any) {
      ShowNotification({ message: error.message, type: "error" });
    }
  };

  const handleResend = async () => {
    try {
      const response = await sendPasswordRecovery({ email: sentEmail });
      ShowNotification({ message: response.message, type: "success" });
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
              Cuida tu contraseña,{" "}
              <span style={{ color: theme.palette.primary.main }}>
                guárdala en un lugar seguro.
              </span>
            </Typography>
            <Typography variant="body2" gutterBottom>
              {emailSent
                ? "Tus comensales pueden ser víctima de estafas."
                : "Tu negocio puede ser atacado si no la cuidas."}
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginTop: theme.spacing(24) }}
            >
              <img
                src={RecoverPasswordImage}
                alt=""
                style={{ width: 360, height: 230, objectFit: "contain" }}
              />
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
            {/* DESKTOP HEADER */}
            <Box
              gap={2}
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                opacity: emailSent ? 0 : 1,
              }}
            >
              <Typography variant="body2">¿Ya tienes una cuenta?</Typography>
              <Link to={`${ROUTES.LOGIN}`} variant="accent">
                Inicia sesión
              </Link>
            </Box>
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
                {emailSent ? "¡Hecho!" : "Recuperar contraseña"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  width: "100%",
                  marginBottom: theme.spacing(6),
                }}
              >
                {emailSent
                  ? "Te hemos enviado un correo electrónico con instrucciones para restablecer la contraseña."
                  : "Ingresa tus datos a continuación para solicitar el restablecimiento de la contraseña de tu cuenta."}
              </Typography>

              {!emailSent && (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  validateOnMount={true}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    isValid,
                    errors,
                    touched,
                    values,
                  }) => (
                    <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                      <Box marginBottom={theme.spacing(4)}>
                        <Field
                          name="email"
                          component={Input}
                          label="Correo electrónico"
                          type="email"
                          required
                          placeholder="nombre@correo.com"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          value={values.email}
                          onChange={(e: React.ChangeEvent<any>) => {
                            setFieldValue("email", e.target.value);
                          }}
                        />
                      </Box>
                      <SubmitButtonWithCountdown
                        type="submit"
                        variant="contained"
                        color="primary"
                        isValid={isValid}
                        sx={{
                          marginTop: theme.spacing(2),
                          marginBottom: theme.spacing(6),
                        }}
                        fullWidth
                        onSubmit={handleSubmit}
                      >
                        Enviar
                      </SubmitButtonWithCountdown>
                    </Form>
                  )}
                </Formik>
              )}
              {!!emailSent && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    sx={{ marginBottom: theme.spacing(6) }}
                    onClick={() => navigate(ROUTES.LOGIN)}
                  >
                    Volver al login
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{
                      width: "100%",
                    }}
                  >
                    Revisa tu bandeja de entrada, incluyendo la carpeta de spam.
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h5">¿No te llegó?</Typography>
                    <Button size="small" onClick={handleResend}>
                      Reenviar
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecoverPassword;
