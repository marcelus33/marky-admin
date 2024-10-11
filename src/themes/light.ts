import { createTheme } from "@mui/material/styles";
// import { components } from "./utils/components";
import typography from "./utils/typography";
import components from "./utils/components";
import colors from "./utils/colors";
// TODO: use colors from utils?
const lightTheme = createTheme({
  spacing: 4,
  palette: {
    mode: "light",
    primary: {
      main: colors.light.primary.main, // Accessing from colors object
      dark: colors.light.primary.dark,
    },
    secondary: {
      main: colors.light.secondary.main,
    },
    error: {
      main: colors.light.error.main,
      light: colors.light.error.light,
    },
    success: {
      main: colors.light.success.main,
      light: colors.light.success.light,
    },
    text: {
      primary: colors.light.text.primary,
      secondary: colors.light.text.secondary,
      disabled: colors.light.text.disabled,
    },
    grey: {
      900: colors.light.grey[900],
      800: colors.light.grey[800],
      600: colors.light.grey[600],
      400: colors.light.grey[400],
      100: colors.light.grey[100],
    },
    background: {
      default: colors.light.background.default,
      paper: colors.light.background.paper,
    },
  },
  typography,
  //@ts-ignore
  components,
});

export default lightTheme;
