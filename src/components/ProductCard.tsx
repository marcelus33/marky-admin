import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
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
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  product: ProductGridItem;
  onClick?: () => void;
}

const LineClamp = styled(Typography)({
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const DropdownMenu: React.FC<{ product: ProductGridItem }> = ({ product }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const navigate = useNavigate();

  console.log("dproduct", product);

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
          // handleMenuOpen(product.id); // or open a menu
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
      >
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            event.stopPropagation();
            navigate(ROUTES.PRODUCT_EDIT.replace(":id", product.id + ""));
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            // onPromotionClick?.();
            // handleClose();
          }}
        >
          <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} />
          Producto en promoción
        </MenuItem>
        <MenuItem>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Copiar URL
        </MenuItem>
        <MenuItem
          onClick={() => {
            // onDeleteCategory?.();
            // handleClose();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
        <Divider />
        <Box px={2} py={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isUnavailable}
                onChange={(e) => {
                  // setIsUnavailable(e.target.checked);
                  // onToggleAvailability?.(e.target.checked);
                }}
              />
            }
            label={
              <Box>
                <Typography>No disponible</Typography>
                <Typography variant="caption" color="text.secondary">
                  Al marcar esta opción, todos los productos continuarán
                  mostrándose pero con el estado "No disponible"
                </Typography>
              </Box>
            }
            sx={{ alignItems: "start" }}
          />
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

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
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
        {product.discountPercent && (
          <Chip
            label={`-${product.discountPercent}%`}
            color="error"
            size="small"
            sx={{ position: "absolute", top: 8, left: 8 }}
          />
        )}
      </Box>

      <DropdownMenu product={product} />

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

        {/* Optional tag */}
        {product.isFavorite && (
          <Box
            sx={{
              width: "fit-content",
              // height: 32,
              backgroundColor: "#FFD600",
              color: "#333",
              fontWeight: "500",
              fontSize: "0.875rem",
              lineHeight: "32px",
              // textAlign: "center",
              position: "relative",
              borderRight: "20px solid transparent",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              pl: 2,
              mb: 2,
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0% 100%)",
            }}
          >
            Favorito del mes
          </Box>
        )}
        {product.isRecommended && !product.isFavorite && (
          <Box
            sx={{
              width: "fit-content",
              // height: 32,
              backgroundColor: "primary.main",
              color: "#FFF",
              fontWeight: "500",
              fontSize: "0.875rem",
              lineHeight: "32px",
              // textAlign: "center",
              position: "relative",
              borderRight: "20px solid transparent",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              pl: 2,
              mb: 2,
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0% 100%)",
            }}
          >
            Recomendado
          </Box>
        )}

        {/* Product name */}
        <LineClamp variant="body2">{product.name}</LineClamp>

        {/* Prices */}
        <Box mt={1}>
          <Typography color="primary" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
          {product.priceAlt && (
            <Typography variant="body2" color="textSecondary">
              {formatPrice(product.priceAlt)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
