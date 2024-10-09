// EmailVerification.tsx
import React, { useState } from "react";
import { Button, TextField, Typography, Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ROUTES } from "../routes/paths";
import Link from "../components/Link";
import { ReactComponent as VerifyEmail } from "../assets/images/verify_email.svg";
import SubmitButtonWithCountdown from "../components/ButtonCountdown";
import VerificationCodeInput from "../components/VerificationCodeInput";

const EmailVerification: React.FC = () => {
  const theme = useTheme();
  const [verificationCode, setVerificationCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeComplete = (code: string) => {
    console.log("Código completo:", code);
  };

  const handleCodeChange = (complete: boolean) => {
    setIsComplete(complete);
  };

  const handleSubmit = () => {
    if (!verificationCode) {
      setError("Por favor, ingrese el código de verificación.");
    } else {
      // Aquí procesas la verificación
      console.log("Código de verificación:", verificationCode);
      setError(null);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid
          item
          xs={12}
          //   md={8}
          sx={{
            // border: "2px solid red",
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
              width: { md: "60%", lg: "40%" },
              margin: "0 auto",
              //   border: "2px solid red",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
              minHeight="100vh"
              padding={2}
              //   sx={{ border: "2px solid blue" }}
            >
              <Box
                display="flex"
                justifyContent="center"
                sx={{ marginTop: theme.spacing(24) }}
              >
                <VerifyEmail />
              </Box>
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: theme.spacing(6),
                }}
                variant="h2"
              >
                Verificación de Identidad
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: theme.spacing(6),
                }}
              >
                Ingresa el código de 6 dígitos que enviamos a tu correo.
              </Typography>

              <VerificationCodeInput
                length={6}
                onComplete={handleCodeComplete}
                onChangeCode={handleCodeChange}
                sx={{ marginBottom: theme.spacing(6) }}
              />

              <SubmitButtonWithCountdown
                type="submit"
                variant="contained"
                color="primary"
                // disabled={!isComplete}
                sx={{
                  marginTop: theme.spacing(2),
                  marginBottom: theme.spacing(6),
                  width: "100%",
                }}
                onSubmit={() => console.log("Submitting...")}
                fullWidth
              >
                Recuperar contraseña
              </SubmitButtonWithCountdown>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailVerification;
