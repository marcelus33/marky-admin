import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ReactComponent as GoogleIcon } from "../assets/icons/google.svg";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as LoginImage } from "../assets/images/login.svg";
import CheckboxWithLabel from "../components/CheckboxWithLabel";
import DividerWithText from "../components/DividerWithText";
import Input from "../components/Input";
import Link from "../components/Link";

const Login: React.FC = () => {
  const theme = useTheme();
  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Este campo es obligatorio"),
    password: Yup.string().required("Este campo es obligatorio"),
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
              Tus comensales merecen atención,{" "}
              <span style={{ color: theme.palette.primary.main }}>
                consiéntelos.
              </span>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Apóyate en tu plataforma gastronómica pensada para lograrlo.
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
              <Link>
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
                Inicia sesión
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
                  boxShadow: 0,
                  marginBottom: theme.spacing(6),
                }}
                fullWidth
                startIcon={<GoogleIcon />}
              >
                Continuar con Google
              </Button>
              <DividerWithText>
                <Typography variant="h5" color="textDisabled">
                  o accede con tus datos registrados
                </Typography>
              </DividerWithText>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, setFieldValue, values, handleChange }) => (
                  <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <Box
                      sx={{
                        marginBottom: theme.spacing(4),
                        marginTop: theme.spacing(6),
                      }}
                    >
                      <Field
                        name="email"
                        render={({ field, meta }: FieldProps) => (
                          <Input
                            label="Correo electrónico"
                            type="email"
                            required
                            placeholder="nombre@correo.com"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={
                              meta.touched && meta.error
                                ? String(meta.error)
                                : undefined
                            }
                            // onChange={(e) =>
                            //   setFieldValue("email", e.target.value)
                            // }
                            {...field}
                          />
                        )}
                      />
                    </Box>
                    <Box sx={{ marginBottom: theme.spacing(4) }}>
                      <Field
                        name="password"
                        render={({ field, meta }: FieldProps) => (
                          <Input
                            label="Contraseña"
                            type="password"
                            required
                            placeholder="Ingrese su contraseña"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={
                              meta.touched && meta.error
                                ? String(meta.error)
                                : undefined
                            }
                            // onChange={(e) =>
                            //   setFieldValue("password", e.target.value)
                            // }
                            {...field}
                          />
                        )}
                      />
                    </Box>
                    {/*  */}
                    <Box
                      display={"flex"}
                      flexDirection={{ xs: "column", sm: "row" }}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      sx={{
                        marginBottom: theme.spacing(4),
                      }}
                    >
                      <Field
                        name="rememberMe"
                        id="rememberMe"
                        type="checkbox"
                        checked={values.rememberMe}
                        onChange={handleChange}
                        as={CheckboxWithLabel}
                        label="Mantener mi sesión iniciada"
                      />
                      <Link>
                        <Typography variant="link">
                          ¿Olvidaste tu contraseña?
                        </Typography>
                      </Link>
                    </Box>

                    {/*  */}
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Iniciar sesión
                    </Button>
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

export default Login;
