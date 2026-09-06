import { Box, Typography } from "@mui/material";
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

  const category = resolvedCategory ?? selectedCategory;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
        Categoría del producto
      </Typography>
      {category ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
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
              backgroundColor: "grey.50",
              borderRadius: 1,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">{category.name}</Typography>
            <Typography
              component="button"
              type="button"
              onClick={onOpenModal}
              variant="body2"
              color="primary.main"
              fontWeight="bold"
              sx={{
                background: "none",
                border: "none",
                p: 0,
                cursor: "pointer",
              }}
            >
              Cambiar
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          component="button"
          type="button"
          onClick={onOpenModal}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            border: "2px dashed",
            borderColor: "primary.main",
            borderRadius: 2,
            backgroundColor: "transparent",
            px: 4,
            py: 2,
            cursor: "pointer",
          }}
        >
          <Typography variant="body2" color="primary.main" fontWeight="bold">
            Selecciona una categoría
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CategorySelector;
