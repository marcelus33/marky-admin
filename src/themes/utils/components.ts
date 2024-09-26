import colors from "./colors";
import typography from "./typography";

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
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
          color: colors.light.secondary,
        },
      },
    },
  },
};

export default components;
