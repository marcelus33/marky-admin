import { Box, Typography } from "@mui/material";
import React from "react";
import { ProductVariant } from "../../../types/product";
import { formatPrice } from "../../../utils/format";
import defaultProductImage from "../../../assets/images/producto_sin_imagenes.png";

const ProductVariantsList: React.FC<{ variants: ProductVariant[] }> = ({
  variants,
}) => {
  if (!variants || variants.length === 0) return null;

  const getVariantImageUrl = (image?: File | string) => {
    if (!image) return undefined;
    if (typeof image === "string") return image;
    try {
      return URL.createObjectURL(image as File);
    } catch (e) {
      return undefined;
    }
  };

  return (
    <Box sx={{ mt: 0 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={4}>
        Variaciones
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {variants.map((v, index) => {
          const imageUrl = getVariantImageUrl(v.image) ?? defaultProductImage;
          return (
            <Box
              key={v.id ?? index}
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 2,
                backgroundColor: "grey.50",
              }}
            >
              <Box display="flex" gap={2} alignItems="center">
                <Box
                  component="img"
                  src={imageUrl}
                  alt={v.name}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    objectFit: "cover",
                    backgroundColor: "grey.200",
                  }}
                />
                <Box>
                  <Typography>{v.name}</Typography>
                  {v.description && (
                    <Typography variant="caption" color="text.secondary">
                      {v.description}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="end"
                justifyContent={"flex-end"}
                gap={1}
                flexDirection={"column"}
              >
                {v.primaryPrice ? (
                  <Typography color="primary" fontWeight={600}>
                    {v.primaryPrice}
                  </Typography>
                ) : (
                  <Typography color="primary" fontWeight={600}>
                    {formatPrice(v.price)}
                  </Typography>
                )}

                {v.secondaryPrice && (
                  <Typography variant="body2" color="grey.500">
                    {v.secondaryPrice}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProductVariantsList;
