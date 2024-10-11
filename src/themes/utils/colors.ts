// src/utils/colors.ts

const colors = {
  light: {
    primary: {
      main: "#337AEA", // Primary color
      dark: "#2962CB", // Primary hover
    },
    secondary: {
      main: "#E8F3FF", // Secondary color
    },
    error: {
      main: "#F64848", // Error color
      light: "#FFEAEA", // Error background
    },
    success: {
      main: "#219F5E", // Success color
      light: "#C8F6CD", // Success background
    },
    text: {
      primary: "#4B4B4B", // Primary text color
      secondary: "#333333", // Logos text color
      disabled: "#9E9EA6", // Placeholder text color
    },
    grey: {
      900: "#9E9EA6", // Placeholder text color
      800: "#D7D7D7", // Input borders
      600: "#E6E6E6", // Config buttons background (non-primary)
      400: "#EDEDED", // Hover color for grey-60 elements
      100: "#EDEDED", // Background for inputs with data
    },
    background: {
      default: "#FFFFFF", // App background (light theme)
      paper: "#F5F5F5", // Paper background
    },
  },
  dark: {
    primary: {
      main: "#337AEA", // Primary color
      dark: "#2962CB", // Primary hover
    },
    secondary: {
      main: "#E8F3FF", // Secondary color
    },
    error: {
      main: "#F64848", // Error color
      light: "#FFEAEA", // Error background
    },
    success: {
      main: "#219F5E", // Success color
      light: "#C8F6CD", // Success background
    },
    text: {
      primary: "#F5F5F5", // Primary text color for dark mode
      secondary: "#FFFFFF", // Logos text color for dark mode
      disabled: "#9E9EA6", // Placeholder text color for dark mode
    },
    grey: {
      900: "#9E9EA6", // Placeholder text color
      800: "#D7D7D7", // Input borders
      600: "#E6E6E6", // Config buttons background (non-primary)
      400: "#EDEDED", // Hover color for grey-60 elements
      100: "#EDEDED", // Background for inputs with data
    },
    background: {
      default: "#1c1e21", // App background (dark theme)
      paper: "#282828", // Paper background
    },
  },
};

export default colors;
