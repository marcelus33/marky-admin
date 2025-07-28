import colors from "./colors";
import typography from "./typography";

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        padding: "11px 0 11px 0",
        gap: "8px",
        borderRadius: "6px",
        opacity: 1,
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: colors.light.text.primary,
        "&.MuiFormLabel-root": {
          color: colors.light.text.primary,
        },
        fontSize: "14px",
        lineHeight: "22px",
        letterSpacing: "-0.1px",
        fontWeight: 500,
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: colors.light.grey[100],
        "&.Mui-checked": {
          color: colors.light.primary,
        },
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      // For Chrome, Safari, Edge, Opera
      "*::-webkit-scrollbar": {
        width: "6px",
      },
      "*::-webkit-scrollbar-track": {
        background: "#f1f1f1",
        borderRadius: "4px",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "#c1c1c1",
        borderRadius: "4px",
      },
    },
  },
};

export default components;
