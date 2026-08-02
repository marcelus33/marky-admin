import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryIcons from "../assets/icons/category/categoryIcons";
import { ReactComponent as CrownIcon } from "../assets/icons/crown.svg";
import { ROUTES } from "../routes/paths";
import { CategoryWithProducts } from "../types/categoryWithProducts";
import ProductCard from "./ProductCard";

interface CategoryGroupProps {
  category: CategoryWithProducts;
  onPromotionClick?: (category: CategoryWithProducts) => void;
  onDeleteCategory?: () => void;
  onToggleAvailability?: (checked: boolean) => void;
  onProductPromotionClick?: (product: any) => void;
  onProductDeleteClick?: (product: any) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  onPromotionClick,
  onDeleteCategory,
  onToggleAvailability,
  onProductPromotionClick,
  onProductDeleteClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // no local-only state: rely on query cache optimistic updates
  const isUnavailable = !category.is_available;
  const navigate = useNavigate();

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
    const {
      promotion_starts_at,
      promotion_ends_at,
      multibuy_option,
      discount_percentage,
    } = category;
    if (!promotion_ends_at) return null;

    const now = new Date();
    const starts = promotion_starts_at ? new Date(promotion_starts_at) : null;
    const ends = new Date(promotion_ends_at);

    // decide badge color based on promotion type
    const hasDiscount =
      !!discount_percentage && parseFloat(discount_percentage as string) > 0;
    const hasMultibuy = !!multibuy_option;
    const badgeColor = hasDiscount
      ? "error.main"
      : hasMultibuy
        ? "primary.main"
        : "primary.main";

    // If promotion hasn't started yet
    if (starts && now < starts) {
      const diff = starts.getTime() - now.getTime();
      return (
        <Box
          sx={{
            backgroundColor: badgeColor,
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 3,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            ml: 2,
          }}
        >
          Empieza en {formatRemainingDetailed(diff)}
        </Box>
      );
    }

    // If promotion already ended
    if (now >= ends) return null;

    // Promotion active
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
          ml: 2,
        }}
      >
        Finaliza en {formatRemainingDetailed(diff)}
      </Box>
    );
  };

  const renderAvailabilityBadge = () => {
    if (category.is_available) return null;
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
          ml: 2,
        }}
      >
        <Typography color="white" fontWeight={500}>
          No disponible
        </Typography>
      </Box>
    );
  };

  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const getIconComponent = (cat: CategoryWithProducts) => {
    const IconComponent =
      cat.icon && categoryIcons[cat.icon] ? categoryIcons[cat.icon] : null;

    return IconComponent ? (
      <Box sx={{ backgroundColor: "grey.200", borderRadius: 2, px: 1 }}>
        <IconComponent fontSize="small" />
      </Box>
    ) : (
      <Box
        sx={{ backgroundColor: "grey.200", borderRadius: 2, px: 3.5, py: 3 }}
      >
        <CrownIcon fontSize="small" />
      </Box>
    );
  };

  return (
    <Box mb={6}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={5}
        sx={{
          position: "sticky",
          top: "4rem",
          zIndex: 1,
          backgroundColor: "white",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={3}>
          {getIconComponent(category)}
          <Typography variant="subtitle1" fontWeight="bold">
            {category.name}
          </Typography>
        </Box>
        {renderPromotionBadge()}
        {renderAvailabilityBadge()}
        <IconButton
          onClick={handleOpen}
          sx={{ backgroundColor: "grey.200", borderRadius: 2, p: 2.5 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
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
            onClick={() => {
              navigate(ROUTES.PRODUCT_CREATE);
              handleClose();
            }}
            sx={{
              borderRadius: 2,
              p: 3,
              display: "flex",
              gap: 4,
            }}
          >
            <AddIcon fontSize="medium" />
            <Typography>Añadir producto</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onPromotionClick?.(category);
              handleClose();
            }}
            sx={{
              borderRadius: 2,
              p: 3,
              display: "flex",
              gap: 4,
            }}
          >
            <LocalOfferIcon fontSize="medium" />
            <Typography>Categoría en promoción</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDeleteCategory?.();
              handleClose();
            }}
            sx={{
              borderRadius: 2,
              p: 3,
              display: "flex",
              gap: 4,
            }}
          >
            <DeleteIcon fontSize="medium" />
            <Typography color="error">Eliminar categoría</Typography>
          </MenuItem>
          <Divider />
          <Box px={2} py={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isUnavailable}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onToggleAvailability?.(checked);
                  }}
                />
              }
              label={<Typography variant="body2">No disponible</Typography>}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 28, // Bigger checkbox
                  borderRadius: 6, // Rounded corners (not fully circular)
                },
              }}
            />
            <Box>
              <Typography variant="caption" color="textDisabled">
                Al marcar esta opción, todos los productos continuarán
                mostrándose pero con el estado "No disponible"
              </Typography>
            </Box>
          </Box>
        </Menu>
      </Box>

      {/* Grid of products */}
      <Box
        display={"grid"}
        gridTemplateColumns={{
          xs: "repeat(2, 1fr)", // 2 columns on phones
          sm: "repeat(3, 1fr)", // 3 on small screens
          md: "repeat(4, 1fr)", // 4 on medium
          lg: "repeat(5, 1fr)", // ✅ 5 columns on large screens
        }}
        gap={{ xs: 4, md: 6 }}
        // gap={2}
      >
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => {
              navigate(ROUTES.PRODUCT_DETAIL.replace(":id", product.id + ""));
            }}
            onPromotionClick={onProductPromotionClick}
            onDeleteClick={onProductDeleteClick}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryGroup;
