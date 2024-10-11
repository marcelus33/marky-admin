import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ReactComponent as GoogleIcon } from "../assets/icons/google.svg";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as LoginImage } from "../assets/images/email_verification_send.svg";
import CheckboxWithLabel from "../components/CheckboxWithLabel";
import DividerWithText from "../components/DividerWithText";
import Input from "../components/Input";
import Link from "../components/Link";
import { ROUTES } from "../routes/paths";
import SubmitButtonWithCountdown from "../components/ButtonCountdown";

const EmailVerificationSend: React.FC = () => {
  const theme = useTheme();
  const initialValues = {
    email: "test@test.com",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Este campo es obligatorio"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    // Add your login logic here (e.g., API call)
    console.log("Logging in with:", values);
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
              Tu seguridad e identidad{" "}
              <span style={{ color: theme.palette.primary.main }}>
                es lo más importante.
              </span>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Verifica tu correo electrónico y podrás iniciar sesión para
              acceder a tu cuenta comercial.
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginTop: theme.spacing(24) }}
            >
              <LoginImage />
            </Box>
          </Box>
        </Grid>
        {/* =========== LOGIN FORM CONTAINER ============= */}
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
              }}
            >
              <Typography variant="body2">¿Aún no formas parte?</Typography>
              <Link to={`${ROUTES.REGISTER}`}>
                <Typography variant="link">Registrate ahora</Typography>
              </Link>
            </Box>
            {/* MOBILE HEADER */}
            <Box
              sx={{
                width: "100%",
                padding: theme.spacing(2.75, 4, 2, 4),
                gap: 0,
                boxShadow: "0px 1px 0px 0px #E8E9EB",
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
              justifyContent={"flex-start"}
            >
              <Box>
                <LogoMarkyBlack />
              </Box>
            </Box>
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
                  textAlign: "left",
                  marginBottom: theme.spacing(6),
                }}
                variant="h2"
              >
                ¡Verifiquemos tu identidad!
              </Typography>

              <Typography variant="body2">
                Te hemos enviado un correo electrónico con un enlace para
                verificar tu cuenta. Revisa tu bandeja de entrada.
              </Typography>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  handleSubmit,
                  setFieldValue,
                  values,
                  handleChange,
                  errors,
                  touched,
                }) => (
                  <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <Box
                      sx={{
                        marginBottom: theme.spacing(4),
                        marginTop: theme.spacing(6),
                      }}
                    >
                      <Field
                        name="email"
                        component={Input}
                        // label="Correo electrónico"
                        type="email"
                        disabled
                        // required
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        value={values.email}
                        onChange={(e: React.ChangeEvent<any>) => {
                          setFieldValue("email", e.target.value);
                        }}
                      />
                    </Box>

                    {/* <Box
                      sx={{
                        marginTop: theme.spacing(6),
                        marginBottom: theme.spacing(3),
                      }}
                    >
                      <DividerWithText>
                        <Typography variant="body2">
                          ¿No recibiste el correo?
                        </Typography>
                      </DividerWithText>
                    </Box> */}

                    <SubmitButtonWithCountdown
                      type="submit"
                      variant="contained"
                      color="primary"
                      isDisabledOnMount={true}
                      sx={{
                        marginBottom: theme.spacing(3),
                        width: "100%",
                      }}
                      onSubmit={() => console.log("Submitting...")}
                      fullWidth
                    >
                      Reenviar
                    </SubmitButtonWithCountdown>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        marginBottom: theme.spacing(6),
                      }}
                    >
                      Revisa detenidamente tu correo, incluyendo la carpeta de
                      spam.
                    </Typography>
                    <Box display={"flex"} justifyContent={"center"}>
                      <Link to={`${ROUTES.LOGIN}`}>
                        <Typography variant="link" sx={{ textAlign: "center" }}>
                          Volver al login
                        </Typography>
                      </Link>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailVerificationSend;
