// AttributesInfo.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Attribute } from "..";

interface AttributesInfoProps {
  attributes: Attribute[];
  onOpen: () => void;
}

const AttributesInfo: React.FC<AttributesInfoProps> = ({
  attributes,
  onOpen,
}) => {
  const isEmpty = !attributes || Object.keys(attributes).length === 0;
  return (
    <Box
      onClick={onOpen}
      sx={{
        border: isEmpty ? "1px dashed #B8CDF5" : "none",
        backgroundColor: isEmpty ? "#FAFCFF" : "transparent",
        borderRadius: isEmpty ? "6px" : 2,
        py: isEmpty ? 4 : 4,
        px: isEmpty ? 3 : 4,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      {isEmpty ? (
        <Typography
          sx={{
            color: "#2563EB",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "22px",
          }}
        >
          Agrega tus atributos
        </Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {attributes.map((attr: any) => (
            <Box
              key={attr.id}
              sx={{ backgroundColor: "#E8F3FF", padding: 1, borderRadius: 1 }}
            >
              <Typography variant="body2" color="primary">
                {attr.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AttributesInfo;
