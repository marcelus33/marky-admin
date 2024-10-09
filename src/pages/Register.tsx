import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, FieldProps, Form, Formik } from "formik";
import React, { useState } from "react";
import "react-phone-input-2/lib/material.css"; // Customizable
import * as Yup from "yup";
import { ReactComponent as GoogleIcon } from "../assets/icons/google.svg";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as RegisterImage } from "../assets/images/register.svg";
import CustomCheckboxWithLabel from "../components/CustomCheckboxWithLabel";
import DividerWithText from "../components/DividerWithText";
import FormikPhoneInput from "../components/FormikPhoneInput";
import Input from "../components/Input";
import Link from "../components/Link";
import { ROUTES } from "../routes/paths";

const AcceptTermsLabel = () => {
  return (
    <Typography component="span">
      Al continuar, estás de acuerdo con nuestros{" "}
      <Link>
        <Typography variant="link">Términos del Servicio</Typography>
      </Link>{" "}
      y{" "}
      <Link>
        <Typography variant="link">Políticas de Privacidad</Typography>
      </Link>
      .
    </Typography>
  );
};

const Register: React.FC = () => {
  const theme = useTheme();
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string>("");

  const initialValues = {
    businessName: "",
    email: "",
    phone: "",
    password: "",
    acceptTerms: false,
  };

  const isRequiredMessage = "Este campo es requerido";
  const validationSchema = Yup.object().shape({
    businessName: Yup.string().required(isRequiredMessage),
    email: isGoogleSignup
      ? Yup.string()
      : Yup.string().email("Email no válido").required(isRequiredMessage),
    phone: Yup.string().required(isRequiredMessage),
    password: isGoogleSignup
      ? Yup.string()
      : Yup.string()
          .min(8, "Debe tener al menos 8 carácteres")
          .required(isRequiredMessage),
    acceptTerms: Yup.boolean().oneOf(
      [true],
      "Debe aceptar los términos y condiciones"
    ),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Registering with:", values);
  };

  const handleGoogleSuccess = (response: any) => {
    setIsGoogleSignup(true);
    setGoogleEmail("response.profileObj.email");
    console.log("Google login success:", response);
  };

  const handleGoogleFailure = (error: any) => {
    console.error("Google login failed", error);
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
              Una plataforma creada con amor{" "}
              <span style={{ color: theme.palette.primary.main }}>
                para tus comensales.
              </span>
            </Typography>
            <Typography variant="body2" gutterBottom>
              No sólo de sabor se trata, sorprende a tu audiencia.
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginTop: theme.spacing(24) }}
            >
              <RegisterImage />
            </Box>
          </Box>
        </Grid>
        {/* =========== REGISTER FORM CONTAINER ============= */}
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
              <Typography variant="body2">¿Ya formas parte?</Typography>
              <Link to={`${ROUTES.LOGIN}`}>
                <Typography variant="link">Inicia sesión ahora</Typography>
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
                {isGoogleSignup ? "Cuenta comercial" : "Crea una cuenta"}
              </Typography>
              {!isGoogleSignup ? (
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
                  onClick={handleGoogleSuccess} // Fake Google Login success
                >
                  Continuar con Google
                </Button>
              ) : (
                <Box
                  sx={{
                    marginBottom: theme.spacing(4),
                    width: "100%",
                  }}
                >
                  <Input
                    label="Correo electrónico"
                    type="email"
                    value={googleEmail}
                    placeholder="nombre@correo.com"
                    disabled
                  />
                </Box>
              )}
              {!isGoogleSignup && (
                <DividerWithText>
                  <Typography variant="h5" color="textDisabled">
                    O accede con tus datos
                  </Typography>
                </DividerWithText>
              )}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  handleSubmit,
                  values,
                  handleChange,
                  setFieldValue,
                  errors,
                  touched,
                }) => (
                  <Form
                    onSubmit={handleSubmit}
                    style={{ width: "100%" }}
                    noValidate
                  >
                    <Box
                      sx={{
                        marginBottom: theme.spacing(4),
                        marginTop: theme.spacing(6),
                      }}
                    >
                      <Field
                        name="businessName"
                        component={Input}
                        label="Nombre del comercio"
                        type="text"
                        required
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.businessName && errors.businessName}
                        value={values.businessName}
                        onChange={(e: React.ChangeEvent<any>) => {
                          setFieldValue("businessName", e.target.value);
                        }}
                      />
                    </Box>
                    {!isGoogleSignup && (
                      <>
                        <Box sx={{ marginBottom: theme.spacing(4) }}>
                          <Field
                            name="email"
                            component={Input}
                            label="Correo electrónico"
                            type="email"
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
                            required
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            value={values.password}
                            onChange={(e: React.ChangeEvent<any>) => {
                              setFieldValue("password", e.target.value);
                            }}
                          />
                        </Box>
                      </>
                    )}
                    <Box sx={{ marginBottom: theme.spacing(4) }}>
                      <Field
                        name="phone"
                        required
                        component={FormikPhoneInput}
                        label="Número de teléfono"
                        placeholder="Ingrese su número de teléfono"
                      />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ marginBottom: theme.spacing(4) }}
                    >
                      <Field
                        name="acceptTerms"
                        required
                        render={({ field, meta }: FieldProps) => (
                          <CustomCheckboxWithLabel
                            field={field}
                            label={<AcceptTermsLabel />}
                            meta={meta}
                          />
                        )}
                      />
                    </Box>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        marginTop: theme.spacing(2),
                        marginBottom: theme.spacing(6),
                      }}
                    >
                      Crear cuenta
                    </Button>
                  </Form>
                )}
              </Formik>
              <Box display={"flex"} gap={2}>
                <Typography variant="body2">¿Ya formas parte?</Typography>
                <Link to={`${ROUTES.LOGIN}`}>
                  <Typography variant="link">Inicia sesión ahora</Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
