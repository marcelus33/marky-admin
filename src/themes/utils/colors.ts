// src/utils/colors.ts

const colors = {
  light: {
    primary: "#6C4FFF", // Color primario (#6C4FFF)
    secondary: "#2887E6", // Color secundario (#2887E6)
    background: {
      default: "#F2F2F2", // Color gris claro (#F2F2F2)
      paper: "#FFFFFF", // Fondo de componentes (b-white)
    },
    text: {
      primary: "#1c1e21", // Color texto principal (b-black-80)
      secondary: "#828282", // Color texto secundario (b-black-30)
      disabled: "#9E9EA6", // Color gris 70 para textos deshabilitados
    },
    error: {
      main: "#FF3E3E", // Color de error (b-rojo)
    },
    warning: {
      main: "#FFD401", // Color de advertencia (b-amarillo)
    },
    grey: {
      100: "#EDEDED", // Gris suave (b-gris-10)
      300: "#9E9EA6", // Gris medio (b-gris-70)
      800: "#1c1e21", // Gris oscuro (b-black-80)
    },
  },
  dark: {
    primary: "#6C4FFF", // Mantener el color primario (b-primario)
    secondary: "#2887E6", // Mantener el color secundario (b-secundario)
    background: {
      default: "#1c1e21", // Fondo oscuro (b-black-80)
      paper: "#282828", // Fondo de componentes más claro
    },
    text: {
      primary: "#F2F2F2", // Texto claro para buen contraste en fondo oscuro
      secondary: "#EDEDED", // Texto secundario claro (b-gris-10)
      disabled: "#9E9EA6", // Texto deshabilitado en gris
    },
    error: {
      main: "#FF3E3E", // Color de error (b-rojo)
    },
    warning: {
      main: "#FFD401", // Color de advertencia (b-amarillo)
    },
    grey: {
      100: "#9E9EA6", // Gris claro
      300: "#828282", // Gris medio
      800: "#1c1e21", // Gris oscuro para fondo
    },
  },
};

export default colors;
