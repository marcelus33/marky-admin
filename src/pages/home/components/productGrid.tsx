import AppsIcon from "@mui/icons-material/Apps";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import { Box, Button, Typography } from "@mui/material";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import WarningIcon from "@mui/icons-material/Warning";
import useDeleteProductCategory from "../../../hooks/useDeleteProductCategory";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/paths";
import CategoryGroup from "../../../components/CategoryGroup";
import useUpdateProductCategoryAvailability from "../../../hooks/useUpdateProductCategoryAvailability";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useDebounce from "../../../hooks/useDebounce";
import useProductCategoriesWithProducts from "../../../hooks/useProductCategoriesWithProducts";
import CategoryAdminModal from "./CategoryAdminModal";
import CategoryPromotionModal from "../../../components/CategoryPromotionModal";
import ProductPromotionModal from "../../../components/ProductPromotionModal";
import CategoryFilterModal, { Category } from "./CategoryFilterModal";
import FilterSection from "./FilterSection";

interface FilterValues {
  search: string;
  categories: Category[];
  offer: boolean;
}

export const ProductGrid: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const initialFilters: FilterValues = {
    search: "",
    categories: [],
    offer: false,
  };

  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [hasFiltered, setHasFiltered] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 500);

  const {
    data: categoriesWithProducts,
    isLoading,
    error,
  } = useProductCategoriesWithProducts({
    name: debouncedSearch,
    has_promotion: filters.offer,
    ids: filters.categories.map((c) => c.id).join(","),
  });

  const productCount = categoriesWithProducts?.products_count || 0;

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openCategoryAdminModal, setOpenCategoryAdminModal] = useState(false);
  const [openPromotionModal, setOpenPromotionModal] = useState(false);
  const [selectedPromotionCategory, setSelectedPromotionCategory] =
    useState<any>(null);
  const [openProductPromotionModal, setOpenProductPromotionModal] =
    useState(false);
  const [selectedPromotionProduct, setSelectedPromotionProduct] =
    useState<any>(null);
  const deleteCategoryMutation = useDeleteProductCategory();
  const updateCategoryAvailability = useUpdateProductCategoryAvailability();
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] =
    useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] =
    useState<any>(null);
  const isDeletingCategory =
    (deleteCategoryMutation as any).isLoading ||
    (deleteCategoryMutation as any).status === "loading";

  const handleFilterChange = (newFilters: Partial<FilterValues>) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };
      const isFiltering =
        updatedFilters.search !== "" ||
        updatedFilters.categories.length > 0 ||
        updatedFilters.offer;
      setHasFiltered(isFiltering);
      return updatedFilters;
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Typography>Error loading products.</Typography>;
  }

  return (
    <Box p={2}>
      <Box
        mb={4}
        sx={{
          boxShadow: "0px 1px 0px 0px #E8E9EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 4,
        }}
      >
        <Typography variant="h2" sx={{ display: { xs: "none", md: "block" } }}>
          Cuenta comercial
        </Typography>
        <Box
          display={"flex"}
          sx={{
            width: { xs: "100%", md: "auto" },
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Button
            onClick={() => setOpenCategoryAdminModal(true)}
            variant="grey1"
            sx={{
              width: { xs: "100%", md: "auto" },
              padding: "8px 12px 8px 12px",
              color: "#4B4B4B",
              boxShadow: 0,
            }}
            startIcon={<AppsIcon />}
          >
            Administrar Categorías
          </Button>
          <Button
            startIcon={<LocalCafeIcon />}
            variant="contained"
            color="primary"
            onClick={() => navigate(ROUTES.PRODUCT_CREATE)}
            sx={{
              width: { xs: "100%", md: "auto" },
              padding: "8px 12px 8px 12px",
              boxShadow: 0,
            }}
          >
            Agregar Producto
          </Button>
        </Box>
      </Box>
      {/* Filtros: Search y selects */}
      <Box mb={4}>
        <FilterSection
          values={filters}
          onFilterChange={handleFilterChange}
          setOpenCategoryModal={() => setOpenCategoryModal(true)}
        />
        {hasFiltered && (
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", md: "block" },
              mt: 2,
              textAlign: "left",
            }}
          >
            {productCount === 0
              ? "No se han encontrado productos"
              : `Encontramos ${productCount} productos`}
          </Typography>
        )}
      </Box>
      {/* Modal de filtrado de categorías */}
      <Box>
        <CategoryFilterModal
          open={openCategoryModal}
          onClose={() => setOpenCategoryModal(false)}
          initialSelectedCategories={filters.categories}
          onSubmit={(categories: Category[]) => {
            handleFilterChange({ categories });
          }}
        />
        <CategoryAdminModal
          open={openCategoryAdminModal}
          onClose={(orderChanged) => {
            setOpenCategoryAdminModal(false);
            if (orderChanged) {
              queryClient.invalidateQueries({
                queryKey: ["productCategoriesWithProducts"],
              });
            }
          }}
        />
      </Box>
      {/* Cuadrícula de productos */}
      {categoriesWithProducts?.results.map((cat) => (
        <CategoryGroup
          key={cat.id}
          category={cat}
          onPromotionClick={(c) => {
            setSelectedPromotionCategory(c);
            setOpenPromotionModal(true);
          }}
          onDeleteCategory={() => {
            setSelectedCategoryToDelete(cat);
            setOpenDeleteCategoryDialog(true);
          }}
          onToggleAvailability={(checked) => {
            const newIsAvailable = !checked; // checked === true means "No disponible" => is_available = false

            // Optimistic local update handled inside CategoryGroup; trigger backend update
            updateCategoryAvailability.mutate({
              id: cat.id,
              is_available: newIsAvailable,
            });
          }}
          onProductPromotionClick={(product) => {
            setSelectedPromotionProduct(product);
            setOpenProductPromotionModal(true);
          }}
        />
      ))}
      <ConfirmationDialog
        open={Boolean(openDeleteCategoryDialog)}
        title={"Eliminar categoría"}
        content={
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={4}
          >
            <WarningIcon color="warning" fontSize="large" />
            <Typography variant="body2" fontSize={"medium"}>
              ¿Deseas eliminar la categoría
              {selectedCategoryToDelete
                ? ` "${selectedCategoryToDelete.name}"`
                : ""}
              ? Esta acción no se puede deshacer.
            </Typography>
          </Box>
        }
        onClose={() => {
          if (!isDeletingCategory) {
            setOpenDeleteCategoryDialog(false);
            setSelectedCategoryToDelete(null);
          }
        }}
        onConfirm={() => {
          if (!selectedCategoryToDelete) return;
          deleteCategoryMutation.mutate(selectedCategoryToDelete.id, {
            onSuccess: () => {
              setOpenDeleteCategoryDialog(false);
              setSelectedCategoryToDelete(null);
            },
            onError: () => {
              setOpenDeleteCategoryDialog(false);
            },
          });
        }}
        isLoading={Boolean(isDeletingCategory)}
      />
      <CategoryPromotionModal
        open={openPromotionModal}
        category={selectedPromotionCategory}
        onClose={() => {
          setOpenPromotionModal(false);
          setSelectedPromotionCategory(null);
        }}
      />
      <ProductPromotionModal
        open={openProductPromotionModal}
        product={selectedPromotionProduct}
        onClose={() => {
          setOpenProductPromotionModal(false);
          setSelectedPromotionProduct(null);
        }}
      />
    </Box>
  );
};
