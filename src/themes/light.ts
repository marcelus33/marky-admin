import { createTheme } from "@mui/material/styles";
// import { components } from "./utils/components";
import typography from "./utils/typography";
import components from "./utils/components";
import colors from "./utils/colors";

const lightTheme = createTheme({
  spacing: 4,
  palette: {
    mode: "light",
    primary: {
      main: colors.light.primary,
    },
    secondary: {
      main: colors.light.secondary,
    },
    background: {
      default: colors.light.background.default,
      paper: colors.light.background.paper,
    },
    text: {
      primary: colors.light.text.primary,
      secondary: colors.light.text.secondary,
      disabled: colors.light.text.disabled,
    },
    error: {
      main: colors.light.error.main,
    },
    warning: {
      main: colors.light.warning.main,
    },
    grey: {
      100: colors.light.grey[100],
      300: colors.light.grey[300],
      800: colors.light.grey[800],
    },
  },
  typography,
  //@ts-ignore
  components,
});

export default lightTheme;
