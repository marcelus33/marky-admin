import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  // Changing this value (e.g. the selected tab name) resets the boundary,
  // so navigating away from and back to a section gives it a fresh try
  // instead of staying stuck on the fallback UI.
  resetKey?: string | number;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

// Scoped error boundary used to contain render crashes to a single section
// (e.g. a tab within the product form) instead of letting them bubble up to
// the app-wide AppErrorBoundary, which blanks the entire SPA. A full-app
// blank screen is easily mistaken by users for an unexpected logout, even
// though no session/auth state is actually touched — this boundary keeps
// the rest of the app (and the user's in-progress form data on other tabs)
// intact when a single section misbehaves.
class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error no controlado en una sección del formulario:", error, errorInfo);
  }

  componentDidUpdate(prevProps: SectionErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 240,
            textAlign: "center",
            p: 3,
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Ocurrió un error al mostrar esta sección
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Tu sesión sigue activa y el resto de la información del producto
            no se perdió. Intenta nuevamente o cambia a otra sección.
          </Typography>
          <Button variant="contained" onClick={this.handleRetry}>
            Reintentar
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
