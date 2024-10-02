// src/components/PrivateLayout.tsx
import React from "react";
import { Container } from "@mui/material";
// import Header from "./Header"; // Example of a header component
// import Footer from "./Footer"; // Example of a footer component

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Container>
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </Container>
  );
};

export default PrivateLayout;
