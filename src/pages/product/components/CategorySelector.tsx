import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import categoryIcons from "../../../assets/icons/category/categoryIcons";
import { ReactComponent as CrownIcon } from "../../../assets/icons/crown.svg";
import { Category } from "../../../types/category";

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onOpenModal: () => void;
}

export const CategorySelector = ({
  selectedCategory,
  onOpenModal,
}: CategorySelectorProps) => {
  const IconComponent =
    selectedCategory?.icon && categoryIcons[selectedCategory.icon]
      ? categoryIcons[selectedCategory.icon]
      : null;

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 5,
        mt: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box display={"flex"} alignItems={"center"} gap={2} mb={5}>
          <CategoryIcon />
          <Typography variant="h6">Categoría</Typography>
        </Box>

        <Box sx={{ backgroundColor: "grey.400", borderRadius: 2 }}>
          <IconButton onClick={onOpenModal}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h5" color="textSecondary" sx={{ mb: 3 }}>
        Categoría de producto
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
        >
          <Box
            sx={{
              backgroundColor: "grey.600",
              py: IconComponent ? 1 : 4,
              px: IconComponent ? 1 : 3,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {IconComponent ? (
              <IconComponent fontSize="small" />
            ) : (
              <CrownIcon fontSize="small" />
            )}
          </Box>
          <Box
            sx={{
              p: 3,
              backgroundColor: "grey.100",
              borderRadius: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">
              {selectedCategory?.name ?? "Sin categoría"}
            </Typography>
            {/*  */}
            {selectedCategory && <CheckCircleIcon fontSize="small" />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CategorySelector;
