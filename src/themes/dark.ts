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
      main: "#004FCF", // Darker primary color
      dark: "#0056A2", // Darker primary hover
    },
    secondary: {
      main: "#1C314F", // Darker secondary color
    },
    error: {
      main: "#F64848", // Red-100 for error
      light: "#4F0D0D", // Darker background for errors
    },
    success: {
      main: "#1B7F4A", // Darker green for success
      light: "#123826", // Darker background for success
    },
    text: {
      primary: "#B0B0B0", // Light grey for primary text
      secondary: "#FFFFFF", // White for logos and other important texts
      disabled: "#7A7A7A", // Grey for placeholders
    },
    grey: {
      100: "#7A7A7A", // Placeholder text
      //@ts-ignore
      80: "#5C5C5C", // Borders of inputs
      60: "#1E1E1E", // Background color for config buttons (non-primary)
      40: "#2B2B2B", // Hover color for grey-60 elements
      10: "#121212", // Background for inputs with data
    },
    background: {
      default: "#121212", // Background for the app (dark)
      paper: "#1E1E1E", // Darker paper background
    },
  },
  typography,
  //@ts-ignore
  components: { ...components, ...darkComponents },
});

export default darkTheme;
