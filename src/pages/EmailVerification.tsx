// EmailVerification.tsx
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import { ReactComponent as LoginImage } from "../assets/images/email_verification_send.svg";
import Link from "../components/Link";
import VerificationCodeInput from "../components/VerificationCodeInput";
import { ROUTES } from "../routes/paths";
import { resendVerification, verifyEmail } from "../services/authService";
import { useSessionStore } from "../stores/sessionStore";
import { ShowNotification } from "../utils/utils";

const EmailVerification: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [, setServerMessage] = useState<string | null>(null);
  const { user } = useSessionStore();

  const handleCodeComplete = (code: string) => {
    setVerificationCode(code);
  };

  const handleCodeChange = (complete: boolean) => {
    setIsComplete(complete);
  };

  const handleSubmit = async () => {
    if (!verificationCode) {
      setError("Por favor, ingrese el código de verificación.");
      return;
    }
    try {
      setError(null);
      setServerMessage(null);

      const response = await verifyEmail({
        email: user?.email ?? "",
        verification_code: verificationCode,
      });
      ShowNotification({ message: response.message, type: "success" });
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      ShowNotification({ message: error.message, type: "error" });
    }
  };

  const handleResend = async () => {
    try {
      const userEmail = user?.email ?? "";
      const response = await resendVerification({ email: userEmail });
      ShowNotification({ message: response.message, type: "success" });
    } catch (error: any) {
      ShowNotification({ message: error.message, type: "error" });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
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
              width: { md: "60%", lg: "40%" },
              margin: "0 auto",
              //   border: "2px solid red",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="75vh"
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isComplete}
                fullWidth
                sx={{ marginBottom: theme.spacing(3) }}
                onClick={handleSubmit}
              >
                Verificar
              </Button>

              <Typography
                variant="body2"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: theme.spacing(6),
                  marginTop: theme.spacing(4),
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

              {/* <Button
                type="button"
                variant="text"
                color="primary"
                disabled={!isComplete}
                fullWidth
                sx={{ marginBottom: theme.spacing(3), border: "none" }}
                onClick={handleResend}
              >
                Reenviar
              </Button> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailVerification;
