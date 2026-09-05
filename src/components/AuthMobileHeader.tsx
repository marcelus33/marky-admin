import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import logoMarky from "../assets/images/marky-logo.png";
import { ROUTES } from "../routes/paths";

interface AuthMobileHeaderProps {
  // Disable on pages reached only once the user is already authenticated
  // (e.g. onboarding/configuration), where tapping the logo shouldn't send
  // them back to /login.
  disableLoginLink?: boolean;
}

const AuthMobileHeader: React.FC<AuthMobileHeaderProps> = ({
  disableLoginLink = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        padding: theme.spacing(2.75, 4, 2, 4),
        gap: 0,
        boxShadow: "0px 1px 0px 0px #E8E9EB",
        display: { xs: "flex", md: "none" },
      }}
      justifyContent="center"
    >
      <Box
        onClick={disableLoginLink ? undefined : () => navigate(ROUTES.LOGIN)}
        sx={{
          display: "flex",
          cursor: disableLoginLink ? "default" : "pointer",
        }}
      >
        <img
          src={logoMarky}
          alt="Marky"
          style={{ width: "112px", height: "auto" }}
        />
      </Box>
    </Box>
  );
};

export default AuthMobileHeader;
