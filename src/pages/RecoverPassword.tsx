import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as RecoverPasswordImage } from "../assets/images/recover_password.svg";
import Input from "../components/Input";
import Link from "../components/Link";
import { ROUTES } from "../routes/paths";
import SubmitButtonWithCountdown from "../components/ButtonCountdown";

const RecoverPassword: React.FC = () => {
  const theme = useTheme();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Este campo es obligatorio"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    // TODO
    console.log("Sending recovery link to:", values);
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
              Tus comensales pueden ser víctima de estafas.
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginTop: theme.spacing(24) }}
            >
              <RecoverPasswordImage />
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
              }}
            >
              <Link to={`${ROUTES.LOGIN}`}>
                <Typography variant="link">Volver al login</Typography>
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
                Recuperar contraseña
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  width: "100%",
                  marginBottom: theme.spacing(6),
                }}
              >
                Ingresa tus datos a continuación para solicitar el
                restablecimiento de la contraseña de tu cuenta.
              </Typography>

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
                      Recuperar contraseña
                    </SubmitButtonWithCountdown>
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

export default RecoverPassword;
