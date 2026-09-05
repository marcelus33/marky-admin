import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import AuthMobileHeader from "./AuthMobileHeader";

export const AUTH_FORM_MAX_WIDTH = 440;

// Figma specifies bolder weights / tighter line-heights than the app's
// default theme for headings, labels, links and body copy. These variants
// are shared with pages outside this flow, so the fix is scoped to a nested
// theme here rather than changed globally.
const applyAuthTypography = (outerTheme: Theme) =>
  createTheme(outerTheme, {
    typography: {
      h2: { fontWeight: 700, lineHeight: "32px", letterSpacing: "-0.096px" },
      body2: { lineHeight: "18px", letterSpacing: "-0.1px" },
      link: { fontWeight: 700 },
      button: { lineHeight: "20px", letterSpacing: "-0.1px" },
    },
    components: {
      MuiFormLabel: {
        styleOverrides: {
          root: { fontWeight: 700 },
        },
      },
    },
  });

interface AuthLayoutProps {
  aside?: React.ReactNode;
  header?: React.ReactNode;
  disableLoginLink?: boolean;
  maxWidth?: number;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  aside,
  header,
  disableLoginLink,
  maxWidth = AUTH_FORM_MAX_WIDTH,
  children,
}) => {
  const theme = useTheme();
  const authTheme = useMemo(() => applyAuthTypography(theme), [theme]);

  return (
    <ThemeProvider theme={authTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "100vh",
          "@supports (min-height: 100dvh)": {
            minHeight: "100dvh",
          },
        }}
      >
        {aside}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            paddingTop: { md: theme.spacing(6) },
            paddingX: { md: theme.spacing(9) },
          }}
        >
          <Box display="flex" justifyContent="end" width="100%">
            <Box gap={2} sx={{ display: { xs: "none", md: "flex" } }}>
              {header}
            </Box>
            <AuthMobileHeader disableLoginLink={disableLoginLink} />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingX: { xs: 8, md: 0 },
              paddingY: { xs: 6, md: 2 },
            }}
          >
            <Box sx={{ width: "100%", maxWidth }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
