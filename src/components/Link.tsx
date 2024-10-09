import { styled } from "@mui/material/styles";
import { Link as MUILink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export interface LinkProps {
  variant?: "primary" | "secondary";
  size?: "large" | "medium" | "small";
  to?: string; // Make to optional
}

// Create a styled component that uses RouterLink for routing
const Link = styled(
  // Use PropsWithChildren to allow children in the component
  ({
    variant = "primary",
    size = "medium",
    to = "/",
    children,
    ...props
  }: LinkProps & React.PropsWithChildren<{}>) => {
    return (
      <RouterLink to={to} {...props}>
        {children}
      </RouterLink>
    ); // Pass children to RouterLink
  }
)(({ theme, variant, size }) => {
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
    color: variant === "primary" ? colors.secondary : colors.primary,
    "&:hover": {
      color: variant === "primary" ? colors.primary : colors.secondary,
    },
  };
});

export default Link;
