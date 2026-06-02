import colors from "./colors";

const darkComponents = {
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: colors.dark.text.primary,
        "&.MuiFormLabel-root": {
          color: colors.dark.text.primary,
        },
        fontSize: "14px",
        lineHeight: "22px",
        letterSpacing: "-0.1px",
        fontWeight: 500,
      },
    },
  },
};

export default darkComponents;
