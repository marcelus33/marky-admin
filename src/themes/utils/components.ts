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
        ...typography.h5,
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
};

export default components;
