// ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import lightTheme from "./light";
import darkTheme from "./dark";

// Create the context
const ThemeContext = createContext({
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.palette.mode === "light" ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};
