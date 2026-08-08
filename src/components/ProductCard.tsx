import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tooltip,
  IconButton,
  Checkbox,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import defaultImage from "../assets/images/default-product.png"; // you can replace this path
import { styled } from "@mui/material/styles";
import { ProductGridItem } from "../types/product";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import { formatPrice, truncateText } from "../utils/format";
import { useUpdateProductAvailability } from "../hooks/useProductMutations";
import ProductStopperTag from "./ProductStopperTag";

interface ProductCardProps {
  product: ProductGridItem;
  onClick?: () => void;
  onPromotionClick?: (product: ProductGridItem) => void;
  onDeleteClick?: (product: ProductGridItem) => void;
}

const LineClamp = styled(Typography)({
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const DropdownMenu: React.FC<{
  product: ProductGridItem;
  onPromotionClick?: (product: ProductGridItem) => void;
  onDeleteClick?: (product: ProductGridItem) => void;
}> = ({ product, onPromotionClick, onDeleteClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const updateAvailability = useUpdateProductAvailability();

  // derive initial availability from product payload (may be snake_case or camelCase)
  const initialIsAvailable = Boolean(
    product.is_available ?? product.is_active ?? true,
  );
  const [isUnavailable, setIsUnavailable] = useState(!initialIsAvailable);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
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
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleOpen(e);
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      {/*  */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            marginTop: 2,
            backgroundColor: "white",
            p: 1.5, // inner padding
            maxWidth: 320, // optional, for spacing
          },
        }}
      >
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            event.stopPropagation();
            navigate(ROUTES.PRODUCT_EDIT.replace(":id", product.id + ""));
          }}
          sx={{ py: 4, borderRadius: 2 }}
        >
          <EditIcon fontSize="small" sx={{ mr: 4 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            event.stopPropagation();
            onPromotionClick?.(product);
            handleClose();
          }}
          sx={{ py: 4, borderRadius: 2 }}
        >
          <LocalOfferIcon fontSize="small" sx={{ mr: 4 }} />
          Producto en promoción
        </MenuItem>
        <MenuItem sx={{ py: 4, borderRadius: 2 }}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 4 }} />
          Copiar URL
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            event.stopPropagation();
            onDeleteClick?.(product);
            handleClose();
          }}
          sx={{ color: "error.main", py: 4, borderRadius: 2 }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 4 }} />
          Eliminar
        </MenuItem>
        <Divider />
        <Box px={2} py={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isUnavailable}
                disabled={updateAvailability.isPending}
                onChange={async (e) => {
                  const checked = e.target.checked; // checked === true means "No disponible"
                  const previous = isUnavailable;

                  // optimistic update
                  setIsUnavailable(checked);

                  const id = product.id;
                  if (id) {
                    const fd = new FormData();
                    // persist only the is_available field on the backend
                    const newIsAvailable = !checked;
                    fd.append(
                      "is_available",
                      newIsAvailable ? "true" : "false",
                    );
                    try {
                      await updateAvailability.mutateAsync({
                        id: Number(id),
                        product: fd,
                      });
                      // close the dropdown menu after successful update
                      handleClose();
                    } catch (err) {
                      // revert optimistic update on error
                      setIsUnavailable(previous);
                    }
                  }
                }}
              />
            }
            label={
              <Box>
                <Typography>No disponible</Typography>
              </Box>
            }
          />
          <Box>
            <Typography variant="caption" color="textDisabled">
              Al marcar esta opción, el producto continuará mostrándose pero con
              el estado "No disponible"
            </Typography>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

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
  onClick,
  onPromotionClick,
  onDeleteClick,
}) => {
  const discountNumber = Number(product.discountPercent ?? 0);
  const showDiscount = !isNaN(discountNumber) && discountNumber > 0;
  const discountLabel = showDiscount
    ? discountNumber % 1 === 0
      ? String(discountNumber)
      : String(discountNumber)
    : null;
  const hasMultibuy = !!product.multibuyOption;

  // Helper to format a remaining duration (ms) into a detailed Spanish string
  // Example: "10 días : 11 horas : 30 min"
  const formatRemainingDetailed = (ms: number) => {
    if (ms <= 0) return "0 min";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const daysPart = `${days} ${days === 1 ? "día" : "días"}`;
    const hoursPart = `${hours} ${hours === 1 ? "hora" : "horas"}`;
    const minutesPart = `${minutes} min`;

    return `${daysPart} : ${hoursPart} : ${minutesPart}`;
  };

  const renderPromotionBadge = () => {
    // Prefer mapped camelCase fields from the product mapper, but fall back to
    // original snake_case if needed.
    const promotionStarts = product.promotionStartsAt;
    const promotionEnds = product.promotionEndsAt;

    if (!promotionEnds) return null;

    const now = new Date();
    const starts = promotionStarts ? new Date(promotionStarts) : null;
    const ends = new Date(promotionEnds);

    // The countdown badge always uses the fixed promotion/urgency color.
    // It must never depend on discount, multibuy, price, or any other
    // product attribute — only on the promotion having a time limit.
    const badgeColor = "error.main";

    // If promotion hasn't started yet (empieza en)
    if (starts && now < starts) {
      const diff = starts.getTime() - now.getTime();
      return (
        <Box
          sx={{
            backgroundColor: badgeColor,
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
          {formatRemainingDetailed(diff)}
        </Box>
      );
    }

    // If promotion already ended
    if (now >= ends) return null;

    // Promotion active (finaliza en)
    const diff = ends.getTime() - now.getTime();
    return (
      <Box
        sx={{
          backgroundColor: badgeColor,
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
        {formatRemainingDetailed(diff)}
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
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onClick?.();
      }}
      sx={styles.cardContainer}
    >
      {/* Image and discount tag */}
      <Box position="relative">
        <CardMedia
          component="img"
          image={product.image || defaultImage}
          alt={product.name}
          loading="lazy"
          sx={{
            borderRadius: 2,
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
          }}
        />
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

      <DropdownMenu
        product={product}
        onPromotionClick={onPromotionClick}
        onDeleteClick={onDeleteClick}
      />

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
            otherwise fall back to numeric price / priceAlt formatted with formatPrice */}
        <Box mt={1}>
          {product.primaryPrice ? (
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
