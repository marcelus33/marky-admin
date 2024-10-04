import React from "react";
import { Box, Typography } from "@mui/material";

interface DividerWithTextProps {
  children: React.ReactNode;
}

const DividerWithText: React.FC<DividerWithTextProps> = ({ children }) => {
  return (
    <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
      <Box
        sx={{ flex: 1, borderBottom: "1px solid", borderColor: "grey.400" }}
      />
      <Typography
        variant="body2"
        sx={{ color: "grey.600", paddingLeft: 2, paddingRight: 2 }}
      >
        {children}
      </Typography>
      <Box
        sx={{ flex: 1, borderBottom: "1px solid", borderColor: "grey.400" }}
      />
    </Box>
  );
};

export default DividerWithText;
