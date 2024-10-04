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
      main: "#337AEA", // Primary color
      dark: "#2962CB", // Primary hover
    },
    secondary: {
      main: "#E8F3FF", // Secondary
    },
    error: {
      main: "#F64848", // Red-100 for error
      light: "#FFEAEA", // Red-10 for background
    },
    success: {
      main: "#219F5E", // Green-100 for success
      light: "#C8F6CD", // Green-10 for background success
    },
    text: {
      primary: "#4B4B4B", // Black-80 for primary text
      secondary: "#333333", // Black-100 for logos
      disabled: "#9E9EA6", // Grey-100 for placeholders
    },
    grey: {
      900: "#9E9EA6", // Placeholder text
      800: "#D7D7D7", // Borders of inputs
      600: "#E6E6E6", // Background color for config buttons (non-primary)
      400: "#EDEDED", // Hover color for grey-60 elements
      100: "#EDEDED", // Background for inputs with data
    },
    background: {
      default: "#FFFFFF", // Background for the app (default white for light theme)
      paper: "#F5F5F5", // Default paper background
    },
  },
  typography,
  //@ts-ignore
  components,
});

export default lightTheme;
