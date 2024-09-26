import { styled } from "@mui/material/styles";
import { Link as MUILink } from "@mui/material";

export interface LinkProps {
  variant?: "primary" | "secondary";
  size?: "large" | "medium" | "small";
}

const Link = styled(MUILink)<LinkProps>(
  ({ theme, variant = "primary", size = "medium" }) => {
    const colors = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
    };

    const fontSize =
      size === "large" ? "14px" : size === "small" ? "12px" : "14px";

    return {
      fontSize,
      lineHeight: "22px",
      letterSpacing: "-0.1px",
      fontWeight: variant === "primary" ? 300 : 400,
      textDecoration: "none",
      color: variant === "primary" ? colors.primary : colors.secondary,
      "&:hover": {
        color: variant === "primary" ? colors.secondary : colors.primary,
      },
    };
  }
);

export default Link;
