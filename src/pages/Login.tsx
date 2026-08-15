import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import loginIllustration from "../assets/images/login-illustration.png";
import AuthAside from "../components/AuthAside";
import Input from "../components/Input";
import Link from "../components/Link";
import { ROUTES } from "../routes/paths";
import { login } from "../services/authService";
import { ShowNotification } from "../utils/utils";

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Este campo es obligatorio"),
    password: Yup.string().required("Este campo es obligatorio"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await login({
        username: values.email,
        password: values.password,
      });
      console.log("Login response:", response);
      const { user } = response;
      ShowNotification({ message: "Login con éxito", type: "success" });
      if (!!user && user.has_configuration) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.CONFIGURATION);
      }
      // TODO: navigate("/dashboard"); redirect a configuracion si aun le falta,
      // se puede mandar un valor que se guarda en el store para saber y dependiendo de eso
      // usar protected routes??
    } catch (error: any) {
      // Manejo de errores (mostrar mensaje, etc.)
      console.error("Error logging in:", error);
      ShowNotification({
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <AuthAside
          title="Ya tienes el talento."
          highlight="Ahora muéstralo."
          supportText="Organiza y presenta tus productos en un catálogo digital profesional."
          image={
            <Box
              component="img"
              src={loginIllustration}
              alt=""
              sx={{ width: "100%", maxWidth: 280 }}
            />
          }
        />
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
              <Typography variant="body2">¿No tienes una cuenta?</Typography>
              <Link to={`${ROUTES.REGISTER}`} variant="accent">
                Regístrate
              </Link>
            </Box>
            {/* MOBILE HEADER */}
            <Box
              sx={{
                width: "100%",
                height: "64px",
                paddingX: "16px",
                borderBottom: "1px solid #E5E7EB",
                display: {
                  xs: "flex",
                  md: "none",
                },
                alignItems: "center",
              }}
              justifyContent={"flex-start"}
            >
              <LogoMarkyBlack style={{ width: "112px", height: "auto" }} />
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
              sx={{
                justifyContent: { xs: "flex-start", md: "center" },
                minHeight: "100vh",
                paddingX: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                paddingTop: { xs: "32px", md: theme.spacing(2) },
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "left",
                }}
                variant="h2"
              >
                Inicia sesión en Marky
              </Typography>
              {/* <Button
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
              </DividerWithText> */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }) => (
                  <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <Box
                      sx={{
                        marginBottom: theme.spacing(6),
                        marginTop: theme.spacing(6),
                      }}
                    >
                      <Field
                        name="email"
                        component={Input}
                        label="Correo electrónico"
                        type="email"
                        placeholder="nombre@correo.com"
                        required
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        value={values.email}
                        onChange={(e: React.ChangeEvent<any>) => {
                          setFieldValue("email", e.target.value);
                        }}
                      />
                    </Box>
                    <Box sx={{ marginBottom: theme.spacing(4) }}>
                      <Field
                        name="password"
                        component={Input}
                        label="Contraseña"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        required
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        value={values.password}
                        onChange={(e: React.ChangeEvent<any>) => {
                          setFieldValue("password", e.target.value);
                        }}
                      />
                    </Box>
                    {/*  */}
                    <Box
                      display={"flex"}
                      justifyContent={"flex-end"}
                      sx={{
                        marginBottom: { xs: "32px", sm: theme.spacing(8) },
                      }}
                    >
                      <Link to={`${ROUTES.RECOVER_PASSWORD}`}>
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
                    {/* MOBILE REGISTER ACCESS */}
                    <Box
                      gap={2}
                      sx={{
                        display: { xs: "flex", md: "none" },
                        justifyContent: "center",
                        marginTop: "24px",
                      }}
                    >
                      <Typography variant="body2">
                        ¿No tienes una cuenta?
                      </Typography>
                      <Link to={`${ROUTES.REGISTER}`} variant="accent">
                        Regístrate
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

export default Login;
