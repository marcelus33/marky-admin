// src/components/PublicLayout.tsx
import React from "react";
import { Container } from "@mui/material";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Container>{children}</Container>;
};

export default PublicLayout;
