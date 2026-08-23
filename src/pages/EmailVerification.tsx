// EmailVerification.tsx
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailVerificationIllustration from "../assets/images/email-verification-illustration.png";
import AuthAside from "../components/AuthAside";
import AuthLayout from "../components/AuthLayout";
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
  const [verifying, setVerifying] = useState(false);
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
      setVerifying(true);

      const response = await verifyEmail({
        email: user?.email ?? "",
        verification_code: verificationCode,
      });
      ShowNotification({ message: response.message, type: "success" });
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      ShowNotification({ message: error.message, type: "error" });
    } finally {
      setVerifying(false);
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
    <AuthLayout
      aside={
        <AuthAside
          title="Tu seguridad e identidad"
          highlight="es lo más importante."
          supportText="Verifica tu correo electrónico y podrás iniciar sesión para acceder a tu cuenta comercial."
          image={
            <Box
              component="img"
              src={emailVerificationIllustration}
              alt=""
              sx={{ width: "100%", maxWidth: 300 }}
            />
          }
        />
      }
      header={
        <Link to={`${ROUTES.LOGIN}`}>
          <Typography variant="link">Volver al login</Typography>
        </Link>
      }
    >
      <Typography
        sx={{
          width: "100%",
          textAlign: "center",
          marginBottom: theme.spacing(6),
        }}
        variant="h2"
      >
        ¡Verifiquemos tu correo!
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
        disabled={!isComplete || verifying}
        fullWidth
        sx={{ marginBottom: theme.spacing(3) }}
        onClick={handleSubmit}
      >
        {verifying ? "Verificando, por favor espera..." : "Verificar"}
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
    </AuthLayout>
  );
};

export default EmailVerification;
