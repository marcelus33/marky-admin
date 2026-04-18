import { Box, Typography } from "@mui/material";
import React from "react";
import { Product } from "../../../types/product";
import { formatPrice } from "../../../utils/format";

const ProductDetailPricing: React.FC<{ product: Product }> = ({ product }) => {
  const discount = Number(product.discountPercentage ?? 0);

  // Treat presence of backend "with discount" labels as signal too
  const hasDiscount =
    discount > 0 ||
    !!product.primaryPriceWithDiscount ||
    !!product.secondaryPriceWithDiscount;

  // Fallback computed prices in case backend doesn't provide formatted labels
  const originalPriceComputed = formatPrice(product.price ?? 0);
  const discountedPriceNumber =
    discount > 0
      ? Number(product.price) * (1 - discount / 100)
      : Number(product.price);
  const discountedPriceComputed = formatPrice(discountedPriceNumber);

  // Prefer backend formatted labels when available
  const primaryDiscountedToShow =
    product.primaryPriceWithDiscount ??
    product.primaryPrice ??
    (hasDiscount ? discountedPriceComputed : undefined);
  const primaryOriginalToShow = product.primaryPrice ?? originalPriceComputed;

  const secondaryDiscountedToShow =
    product.secondaryPriceWithDiscount ?? product.secondaryPrice ?? undefined;
  const secondaryOriginalToShow = product.secondaryPrice ?? undefined;

  return (
    <Box sx={{ mt: 8 }}>
      {hasDiscount ? (
        <Box>
          {/* Discounted prices (top, larger) */}
          <Box display="flex" alignItems="center" gap={3}>
            {primaryDiscountedToShow && (
              <Typography color="primary" variant="h2" fontWeight={700}>
                {primaryDiscountedToShow}
              </Typography>
            )}

            {secondaryDiscountedToShow && (
              <Typography color="grey.500" variant="h3" fontWeight={500}>
                {secondaryDiscountedToShow}
              </Typography>
            )}
          </Box>

          {/* Original prices (below, struck-through) */}
          <Box display="flex" alignItems="flex-end" gap={2} sx={{ mt: 0.5 }}>
            {primaryOriginalToShow && (
              <Typography
                variant="body2"
                fontWeight={500}
                fontSize={"medium"}
                color="primary"
                sx={{ textDecoration: "line-through" }}
              >
                {primaryOriginalToShow}
              </Typography>
            )}

            {secondaryOriginalToShow && (
              <Typography
                variant="body2"
                color="grey.500"
                fontSize={"small"}
                sx={{ textDecoration: "line-through" }}
              >
                {secondaryOriginalToShow}
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="flex-end" gap={2}>
          <Typography color="primary" variant="h4" fontWeight={700}>
            {primaryOriginalToShow}
          </Typography>

          {secondaryOriginalToShow && (
            <Typography variant="body2" color="text.secondary">
              {secondaryOriginalToShow}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailPricing;
