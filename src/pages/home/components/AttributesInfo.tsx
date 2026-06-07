// AttributesInfo.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Attribute } from "..";

interface AttributesInfoProps {
  attributes: Attribute[];
  onOpen: () => void;
}

const attributesPlaceholder: Attribute[] = [
  {
    id: 1,
    name: "Wifi",
  },
  {
    id: 2,
    name: "Estacionamiento",
  },
  {
    id: 3,
    name: "+1",
  },
];

const AttributesInfo: React.FC<AttributesInfoProps> = ({
  attributes,
  onOpen,
}) => {
  const isEmpty = !attributes || Object.keys(attributes).length === 0;
  return (
    <Box
      onClick={onOpen}
      sx={{
        border: isEmpty ? "2px dashed" : "none",
        borderColor: "primary.main",
        padding: 4,
        borderRadius: 2,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      {isEmpty ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography color="primary" fontWeight={500}>
            Definir atributos
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {attributes.length < 1 &&
              attributesPlaceholder.map((attr: any) => (
                <Box
                  key={attr.id}
                  sx={{
                    backgroundColor: "grey.200",
                    padding: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="textDisabled">
                    {attr.name}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
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
