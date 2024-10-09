import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as ResetPasswordImage } from "../assets/images/reset_password.svg";
import Input from "../components/Input";
import Link from "../components/Link";
import { ROUTES } from "../routes/paths";

const NewPassword: React.FC = () => {
  const theme = useTheme();

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

  const handleSubmit = (values: typeof initialValues) => {
    // Aquí iría la lógica para cambiar la contraseña.
    console.log("Updating password to:", values.newPassword);
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
                protege tu cuenta y a tus clientes.
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
                Nueva Contraseña
              </Typography>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnMount={true}
              >
                {({ handleSubmit, touched, errors, values, setFieldValue }) => (
                  <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <Box marginBottom={theme.spacing(4)}>
                      <Field
                        name="newPassword"
                        component={Input}
                        label="Nueva Contraseña"
                        type="password"
                        required
                        placeholder="Ingrese su nueva contraseña"
                        error={
                          touched.newPassword && Boolean(errors.newPassword)
                        }
                        helperText={touched.newPassword && errors.newPassword}
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
                        label="Confirmar Contraseña"
                        type="password"
                        required
                        placeholder="Ingrese su nueva contraseña"
                        error={
                          touched.confirmPassword &&
                          Boolean(errors.confirmPassword)
                        }
                        helperText={
                          touched.confirmPassword && errors.confirmPassword
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
                    >
                      Cambiar contraseña
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

export default NewPassword;
