import { createTheme } from "@mui/material/styles";
import typography from "./utils/typography";
import components from "./utils/components";
import colors from "./utils/colors";
import darkComponents from "./utils/darkComponents";

const darkTheme = createTheme({
  spacing: 4,
  palette: {
    mode: "dark",
    primary: {
      main: colors.dark.primary,
    },
    secondary: {
      main: colors.dark.secondary,
    },
    background: {
      default: colors.dark.background.default,
      paper: colors.dark.background.paper,
    },
    text: {
      primary: colors.dark.text.primary,
      secondary: colors.dark.text.secondary,
      disabled: colors.dark.text.disabled,
    },
    error: {
      main: colors.dark.error.main,
    },
    warning: {
      main: colors.dark.warning.main,
    },
    grey: {
      100: colors.dark.grey[100],
      300: colors.dark.grey[300],
      800: colors.dark.grey[800],
    },
  },
  typography,
  //@ts-ignore
  components: { ...components, ...darkComponents },
});

export default darkTheme;
