// DescriptionInfo.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

interface DescriptionInfoProps {
  description: string;
  onOpen: () => void;
}

const DescriptionInfo: React.FC<DescriptionInfoProps> = ({
  description,
  onOpen,
}) => {
  const isEmpty = !description;
  return (
    <Box
      onClick={onOpen}
      sx={{
        border: isEmpty ? "2px dashed" : "none",
        borderColor: "primary.main",
        padding: 4,
        borderRadius: 2,
        cursor: "pointer",
      }}
    >
      {isEmpty ? (
        <Typography color="primary" fontWeight={500} textAlign={"center"}>
          Añadir descripción
        </Typography>
      ) : (
        <Typography
          sx={{
            whiteSpace: "pre-line",
            wordBreak: "break-word",
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default DescriptionInfo;
