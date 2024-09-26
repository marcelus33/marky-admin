import colors from "./colors";
import typography from "./typography";

const darkComponents = {
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: colors.dark.text.primary,
        "&.MuiFormLabel-root": {
          color: colors.dark.text.primary,
        },
        ...typography.h5,
      },
    },
  },
};

export default darkComponents;
