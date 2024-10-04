// src/mui.d.ts (o src/@types/mui.d.ts)
import "@mui/material/Typography";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    link: true;
  }
}
