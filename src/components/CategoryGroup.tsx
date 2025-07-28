import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import categoryIcons from "../assets/icons/category/categoryIcons";
// import categoryIcons from "../../../../assets/icons/category/categoryIcons";
import ProductCard from "./ProductCard";
import { ReactComponent as CrownIcon } from "../assets/icons/crown.svg";
import { useState } from "react";
import { CategoryWithProducts } from "../types/categoryWithProducts";

interface CategoryGroupProps {
  category: CategoryWithProducts;
  onPromotionClick?: () => void;
  onDeleteCategory?: () => void;
  onToggleAvailability?: (checked: boolean) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  onPromotionClick,
  onDeleteCategory,
  onToggleAvailability,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);

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
      <Box display="flex" alignItems="center" gap={2} mb={5}>
        <Box display="flex" alignItems="center" gap={3}>
          {getIconComponent(category)}
          <Typography variant="subtitle1" fontWeight="bold">
            {category.name}
          </Typography>
        </Box>
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
              backgroundColor: "white", // light custom background
              p: 1.5, // inner padding
              maxWidth: 320, // optional, for spacing
            },
          }}
        >
          <MenuItem
            onClick={() => {
              onPromotionClick?.();
              handleClose();
            }}
            sx={{ marginBottom: 2 }}
          >
            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} />
            Categoría en promoción
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDeleteCategory?.();
              handleClose();
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Eliminar categoría
          </MenuItem>
          <Divider />
          <Box px={2} py={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isUnavailable}
                  onChange={(e) => {
                    setIsUnavailable(e.target.checked);
                    onToggleAvailability?.(e.target.checked);
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
        {category.products.map((product, idx) => (
          <ProductCard key={`product-${idx}`} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryGroup;
