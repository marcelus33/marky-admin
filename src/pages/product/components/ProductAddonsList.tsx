import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { ProductAddon } from "../../../types/product";
import { formatPrice } from "../../../utils/format";

const ProductAddonsList: React.FC<{ addons: ProductAddon[] }> = ({
  addons,
}) => {
  if (!addons || addons.length === 0) return null;

  return (
    <Box sx={{ mt: 0 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={4}>
        Adicionales o extras
      </Typography>

      {/* Outer container with rounded corners and subtle border. Inside we render rows
          with separators so the whole block looks like the provided mock. */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          borderColor: "grey.200",
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      >
        {addons.map((a, index) => {
          // backend might provide formatted labels using snake_case or camelCase
          const primaryLabel =
            (a as any).primaryPrice ?? (a as any).primary_price;
          const secondaryLabel =
            (a as any).secondaryPrice ?? (a as any).secondary_price;

          return (
            <Box
              key={a.id ?? index}
              sx={{
                p: 2,
                pl: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // separator between rows except for last
                borderBottom:
                  index !== addons.length - 1 ? "1px solid" : "none",
                borderColor: "grey.200",
              }}
            >
              <Typography>{a.name}</Typography>

              <Box
                display="flex"
                alignItems="end"
                flexDirection={"column"}
                gap={1}
              >
                {primaryLabel ? (
                  <Typography color="primary" fontWeight={600}>
                    {primaryLabel}
                  </Typography>
                ) : (
                  <Typography color="primary" fontWeight={600}>
                    {formatPrice(a.price)}
                  </Typography>
                )}

                {secondaryLabel && (
                  <Typography variant="body2" color="grey.500">
                    {secondaryLabel}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
};

export default ProductAddonsList;
