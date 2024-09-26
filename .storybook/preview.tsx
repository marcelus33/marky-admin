import type { Preview } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import lightTheme from "../src/themes/light";
import darkTheme from "../src/themes/dark";
import React, { useMemo } from "react";
import { Global } from "@emotion/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const THEMES = {
        light: lightTheme,
        dark: darkTheme,
      };
      const { theme: themeKey } = context.globals;
      const theme = useMemo(
        () => THEMES[themeKey] || THEMES["light"],
        [themeKey]
      );
      return (
        <>
          <Global
            styles={`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
            body {
              font-family: 'Roboto', sans-serif;
            }
          `}
          />
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Story />
          </ThemeProvider>
        </>
      );
    },
  ],
};

preview.globalTypes = {
  theme: {
    name: "Theme",
    title: "Theme",
    description: "Theme for your components",
    defaultValue: "light",
    toolbar: {
      icon: "paintbrush",
      dynamicTitle: true,
      items: [
        { value: "light", left: "☀️", title: "Light mode" },
        { value: "dark", left: "🌙", title: "Dark mode" },
      ],
    },
  },
};

export default preview;
