import { Box, Typography } from "@mui/material";
import React from "react";
import { Product } from "../../../types/product";
import ProductStopperTag from "../../../components/ProductStopperTag";

const ProductDetailInfo: React.FC<{ product: Product }> = ({ product }) => {
  const isAvailable = product.is_available ?? product.is_active ?? true;

  return (
    <Box>
      {/* Disponibilidad (texto) */}
      <Typography variant="body1" fontWeight={400} sx={{ mb: 1 }}>
        {isAvailable ? "Disponible" : "No disponible"}
      </Typography>

      {/* Nombre del producto (debajo, más grande y negro) */}
      <Typography
        variant="h2"
        fontWeight={700}
        color="text.primary"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          mb: 1,
        }}
      >
        {product.name}
      </Typography>

      {/* Stopper + categoría en la misma fila */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={product.description ? 3 : 0}
      >
        <ProductStopperTag stopper={product.stopper} />

        {product.category && (
          <Typography variant="body2" color="text.secondary">
            en categoría:{" "}
            <Box component="span" color="primary.main">
              {product.category.name}
            </Box>
          </Typography>
        )}
      </Box>

      {product.description && (
        <Box mt={0}>
          <Typography color="text.secondary">{product.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailInfo;
