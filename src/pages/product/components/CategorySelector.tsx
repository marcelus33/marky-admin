import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import categoryIcons from "../../../assets/icons/category/categoryIcons";
import useProductCategories from "../../../hooks/useProductCategories";
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
  // Try to resolve the full category info when parent only provides an id
  // (this happens on the "duplicate product" flow where we only pass the id).
  const { data: categoriesData } = useProductCategories(
    { include_products: false },
    { enabled: true },
  );

  const categories =
    categoriesData?.results?.map((c: any) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      order: 0,
    })) ?? [];

  const resolvedCategory: typeof selectedCategory | null = (() => {
    if (!selectedCategory) return null;
    const hasName = Boolean(selectedCategory.name);
    const hasIcon = Boolean(selectedCategory.icon);
    // If the prop already has the needed fields, use it as-is
    if (hasName && hasIcon) return selectedCategory;
    // Otherwise try to find a matching category from the fetched list
    const found = categories.find(
      (c) => String(c.id) === String(selectedCategory.id),
    );
    return found ?? selectedCategory;
  })();

  const IconComponent =
    resolvedCategory?.icon && categoryIcons[resolvedCategory.icon]
      ? categoryIcons[resolvedCategory.icon]
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
              {resolvedCategory?.name ??
                selectedCategory?.name ??
                "Sin categoría"}
            </Typography>
            {/*  */}
            {(resolvedCategory || selectedCategory) && (
              <CheckCircleIcon fontSize="small" />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CategorySelector;
