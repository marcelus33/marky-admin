import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import defaultImage from "../assets/images/default-product.png"; // you can replace this path
import { styled } from "@mui/material/styles";
import { ProductGridItem } from "../types/product";
import { formatPrice, truncateText } from "../utils/format";
import { usePromotionCountdown } from "../hooks/usePromotionCountdown";
import ProductStopperTag from "./ProductStopperTag";
import ProductActionsMenu, { ProductCategoryRef } from "./ProductActionsMenu";

interface ProductCardProps {
  product: ProductGridItem;
  currentCategory?: ProductCategoryRef;
  onClick?: () => void;
  onPromotionClick?: (product: ProductGridItem) => void;
  onDeleteClick?: (product: ProductGridItem) => void;
  onMoveClick?: (
    product: ProductGridItem,
    currentCategory?: ProductCategoryRef,
  ) => void;
}

const LineClamp = styled(Typography)({
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const styles = {
  cardContainer: {
    position: "relative",
    width: "100%",
    boxShadow: 0,
    backgroundColor: "transparent",
    transition: "background-color 0.2s",
    cursor: "pointer", // 👈 makes it feel clickable
    "&:hover": {
      backgroundColor: "#f9f9f9", // 👈 subtle highlight
    },
    "&:hover .menu-button": {
      opacity: 1,
    },
    // border: "3px solid red",
  },
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentCategory,
  onClick,
  onPromotionClick,
  onDeleteClick,
  onMoveClick,
}) => {
  const discountNumber = Number(product.discountPercent ?? 0);
  const showDiscount = !isNaN(discountNumber) && discountNumber > 0;
  const discountLabel = showDiscount
    ? discountNumber % 1 === 0
      ? String(discountNumber)
      : String(discountNumber)
    : null;
  // Matches ProductDetailPricing's hasDiscount: also treat presence of
  // backend "with discount" labels as a discount signal, so the grid and
  // detail views stay consistent even if discountPercent reads as 0.
  const hasPriceDiscount =
    showDiscount ||
    !!product.primaryPriceWithDiscount ||
    !!product.secondaryPriceWithDiscount;
  const hasMultibuy = !!product.multibuyOption;

  const promotionCountdown = usePromotionCountdown({
    status: product.promotionStatus,
    startsAt: product.promotionStartsAt,
    endsAt: product.promotionEndsAt,
  });

  const renderPromotionBadge = () => {
    if (!promotionCountdown) return null;

    // The countdown badge always uses a fixed urgency color keyed to the
    // phase (amber while scheduled, red while actively counting down). It
    // must never depend on discount, multibuy, price, or any other product
    // attribute.
    return (
      <Box
        sx={{
          backgroundColor:
            promotionCountdown.phase === "starts"
              ? "warning.main"
              : "error.main",
          color: "white",
          px: 2,
          py: 0.5,
          borderRadius: 1,
          fontSize: 14,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          mt: 1,
          width: "fit-content",
        }}
      >
        {promotionCountdown.label}
      </Box>
    );
  };

  const renderAvailabilityBadge = (product: ProductGridItem) => {
    const isAvailable = product.is_available ?? product.is_active ?? true;
    if (isAvailable) return null;

    return (
      <Box
        sx={{
          backgroundColor: "grey.500",
          color: "white",
          px: 2,
          py: 1,
          borderRadius: 1,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          mt: 1,
          width: "fit-content",
        }}
      >
        <Typography color="white" fontWeight={500}>
          No disponible
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      data-testid="product-card"
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onClick?.();
      }}
      sx={styles.cardContainer}
    >
      {/* Image and discount tag */}
      <Box position="relative">
        <Box
          sx={{
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={product.image || defaultImage}
            alt={product.name}
            loading="lazy"
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
        {/* Badges container (top-left) */}
        <Box
          sx={{
            position: "absolute",
            top: 15,
            left: 15,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            zIndex: 0,
          }}
        >
          {(() => {
            const isAvailable =
              product.is_available ?? product.is_active ?? true;
            if (!isAvailable) {
              return renderAvailabilityBadge(product);
            }

            return (
              <>
                {showDiscount && (
                  <Box
                    component="span"
                    sx={(theme) => ({
                      bgcolor: "error.main",
                      color: theme.palette.common.white,
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      display: "inline-block",
                    })}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        fontSize: 14,
                        color: (theme) => theme.palette.common.white,
                      }}
                    >
                      -{discountLabel}%
                    </Typography>
                  </Box>
                )}

                {hasMultibuy && (
                  <Box
                    component="span"
                    sx={(theme) => ({
                      bgcolor: "primary.main",
                      color: theme.palette.common.white,
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      display: "inline-block",
                    })}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        fontSize: 14,
                        color: (theme) => theme.palette.common.white,
                      }}
                    >
                      {product.multibuyOption}
                    </Typography>
                  </Box>
                )}
              </>
            );
          })()}
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          opacity: 0,
          transition: "opacity 0.2s",
          zIndex: 2,
          "& .MuiIconButton-root": {
            padding: "4px",
          },
          pointerEvents: "auto",
          backgroundColor: "grey.200",
          borderRadius: 2,
          p: 1,
        }}
        className="menu-button"
      >
        <ProductActionsMenu
          product={product}
          currentCategory={currentCategory}
          onPromotionClick={onPromotionClick}
          onDeleteClick={onDeleteClick}
          onMoveClick={onMoveClick}
        />
      </Box>

      <CardContent sx={{ p: 2, backgroundColor: "transparent", mt: 2 }}>
        {/* Views */}
        {product.views !== undefined && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <VisibilityIcon fontSize="small" />
            <Typography variant="caption">
              {product.views.toLocaleString()}
            </Typography>
          </Box>
        )}

        {/* Optional tag (now using reusable stopper) */}
        {(() => {
          const stopper = product.isFavorite
            ? "FAVORITE"
            : product.isRecommended
              ? "RECOMMENDED"
              : undefined;
          return <ProductStopperTag stopper={stopper} />;
        })()}

        {/* Product name */}
        <LineClamp variant="subtitle1">{product.name}</LineClamp>

        {/* Promotion badge: above the description but below the optional tags */}
        {renderPromotionBadge()}
        {/* Description summary: truncated to 60 chars, full text on hover */}
        {product.description && (
          <Tooltip title={product.description} arrow>
            <LineClamp
              variant="body2"
              sx={{ mt: 1, mb: 1, color: "text.secondary" }}
            >
              {truncateText(product.description, 60)}
            </LineClamp>
          </Tooltip>
        )}

        {/* Prices: prefer formatted labels from backend (primaryPrice / secondaryPrice)
            otherwise fall back to numeric price / priceAlt formatted with formatPrice.
            When an active percentage discount applies (and it's not a 2x1/3x2-style
            multibuy promotion), show the discounted price as primary and the
            original price struck through below it. */}
        <Box mt={1}>
          {hasPriceDiscount && !hasMultibuy && product.primaryPriceWithDiscount ? (
            <>
              <Typography color="primary" fontWeight="bold">
                {product.primaryPriceWithDiscount}
              </Typography>
              {product.primaryPrice && (
                <Typography
                  variant="body2"
                  color="grey.500"
                  sx={{ textDecoration: "line-through" }}
                >
                  Antes {product.primaryPrice}
                </Typography>
              )}
              {product.secondaryPriceWithDiscount && (
                <Typography variant="body2" color="grey.500">
                  {product.secondaryPriceWithDiscount}
                </Typography>
              )}
            </>
          ) : product.primaryPrice ? (
            <>
              <Typography color="primary" fontWeight="bold">
                {product.primaryPrice}
              </Typography>
              {product.secondaryPrice && (
                <Typography variant="body2" color="grey.500">
                  {product.secondaryPrice}
                </Typography>
              )}
            </>
          ) : (
            <>
              <Typography color="primary" fontWeight="bold">
                {formatPrice(product.price)}
              </Typography>
              {product.priceAlt && (
                <Typography variant="body2" color="textSecondary">
                  {formatPrice(product.priceAlt)}
                </Typography>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
