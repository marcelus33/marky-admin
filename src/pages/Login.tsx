// src/pages/Login.tsx
import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import Link from "../components/Link";
import colors from "../themes/utils/colors";
import GoogleIcon from "@mui/icons-material/Google";
import { useTheme } from "@mui/material/styles";
import CheckboxWithLabel from "../components/CheckboxWithLabel";
import DividerWithText from "../components/DividerWithText";

const Login: React.FC = () => {
  const theme = useTheme();
  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    // Add your login logic here (e.g., API call)
    console.log("Logging in with:", values);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
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
          }}
        >
          <Box sx={{ padding: 2 }}>
            <Typography variant="h1" gutterBottom>
              Tus comensales merecen atención,{" "}
              <span style={{ color: theme.palette.primary.main }}>
                consiéntelos.
              </span>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Apóyate en tu plataforma gastronómica pensada para lograrlo.
            </Typography>
          </Box>
        </Grid>
        {/* ======================== */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              // border: "2px solid red",
              width: { md: "50%" },
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
                }}
                variant="h1"
                gutterBottom
              >
                Inicia sesión
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  boxShadow: 0,
                }}
                fullWidth
                // startIcon={<GoogleIcon />}
              >
                Continuar con Google
              </Button>
              <DividerWithText>
                <Typography variant="h5" color="textDisabled" gutterBottom>
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
                    <Field
                      name="email"
                      //@ts-ignore
                      render={({ field, meta }) => (
                        <Input
                          label="Correo electrónico"
                          type="email"
                          required
                          placeholder="nombre@correo.com"
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                          //@ts-ignore
                          onChange={(e) =>
                            setFieldValue("email", e.target.value)
                          }
                          {...field}
                        />
                      )}
                    />
                    <Field
                      name="password"
                      //@ts-ignore
                      render={({ field, meta }) => (
                        <Input
                          label="Contraseña"
                          type="password"
                          required
                          placeholder="Ingrese su contraseña"
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                          //@ts-ignore
                          onChange={(e) =>
                            setFieldValue("password", e.target.value)
                          }
                          {...field}
                          style={{ marginTop: "16px" }}
                        />
                      )}
                    />
                    {/*  */}
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Field
                        name="rememberMe"
                        id="rememberMe"
                        type="checkbox"
                        checked={values.rememberMe}
                        onChange={handleChange}
                        as={CheckboxWithLabel} // Utilizamos CheckboxWithLabel como componente
                        label="Mantener mi sesión iniciada"
                      />
                      {/*//@ts-ignore */}
                      <Link variant="primary">
                        <Typography variant="body2">
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
                      Acceder a mi cuenta
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
