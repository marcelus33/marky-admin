import AppsIcon from "@mui/icons-material/Apps";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import { Box, Button, Typography } from "@mui/material";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import WarningIcon from "@mui/icons-material/Warning";
import useDeleteProductCategory from "../../../hooks/useDeleteProductCategory";
import useDeleteProduct from "../../../hooks/useDeleteProduct";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/paths";
import CategoryGroup from "../../../components/CategoryGroup";
import useUpdateProductCategoryAvailability from "../../../hooks/useUpdateProductCategoryAvailability";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useProductCategoriesWithProducts from "../../../hooks/useProductCategoriesWithProducts";
import { CategoryWithProducts } from "../../../types/categoryWithProducts";
import CategoryAdminModal from "./CategoryAdminModal";
import CategoryPromotionModal from "../../../components/CategoryPromotionModal";
import ProductPromotionModal from "../../../components/ProductPromotionModal";
import MoveToCategoryModal, {
  MoveToCategoryModalCurrentCategory,
} from "../../product/components/MoveToCategoryModal";
import CategoryFilterModal, { Category } from "./CategoryFilterModal";
import FilterSection from "./FilterSection";
import EmptyProducts from "./EmptyProducts";
import { useHomePageData } from "../../../hooks/useHomePageData";

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

  // `filters.search` already arrives debounced from FilterSection (it only
  // propagates the value up once the user pauses typing), so no extra
  // debouncing is needed here.
  //
  // NOTE: we deliberately do NOT send `search` to the backend as the
  // `name` param. That endpoint (`with_products`) only filters by
  // *category* name (`ProductCategoryFilter.name`, backend-side) — it has
  // no support for matching a product's own name/description. Sending the
  // search term there was the root cause of "the search bar only finds
  // categories, not products": a product whose name matched but whose
  // category name didn't would never come back from the API at all. So we
  // fetch the (non-text-filtered) categories/products and match the search
  // term against category name AND product name/description client-side
  // below.
  const {
    data: categoriesWithProductsRaw,
    isLoading,
    error,
  } = useProductCategoriesWithProducts({
    has_promotion: filters.offer,
    ids: filters.categories.map((c) => c.id).join(","),
  });

  const categoriesWithProducts = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    if (!categoriesWithProductsRaw || !searchTerm) {
      return categoriesWithProductsRaw;
    }

    const filteredResults = categoriesWithProductsRaw.results
      .map((category: CategoryWithProducts) => {
        const categoryMatches = category.name
          ?.toLowerCase()
          .includes(searchTerm);
        if (categoryMatches) return category;

        const matchingProducts = (category.products || []).filter(
          (product) =>
            product.name?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm),
        );
        if (matchingProducts.length === 0) return null;
        return { ...category, products: matchingProducts };
      })
      .filter((category): category is CategoryWithProducts => !!category);

    const productsCount = filteredResults.reduce(
      (sum, category) => sum + category.products.length,
      0,
    );

    return {
      ...categoriesWithProductsRaw,
      results: filteredResults,
      products_count: productsCount,
    };
  }, [categoriesWithProductsRaw, filters.search]);

  const productCount = categoriesWithProducts?.products_count || 0;
  const { data: homePageData } = useHomePageData();
  const showEmptyState = !hasFiltered && !isLoading && productCount === 0;

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openCategoryAdminModal, setOpenCategoryAdminModal] = useState(false);
  const [openPromotionModal, setOpenPromotionModal] = useState(false);
  const [selectedPromotionCategory, setSelectedPromotionCategory] =
    useState<any>(null);
  const [openProductPromotionModal, setOpenProductPromotionModal] =
    useState(false);
  const [selectedPromotionProduct, setSelectedPromotionProduct] =
    useState<any>(null);
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [selectedMoveProduct, setSelectedMoveProduct] = useState<any>(null);
  const [selectedMoveCurrentCategory, setSelectedMoveCurrentCategory] =
    useState<MoveToCategoryModalCurrentCategory | null>(null);
  const deleteCategoryMutation = useDeleteProductCategory();
  const updateCategoryAvailability = useUpdateProductCategoryAvailability();
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] =
    useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] =
    useState<any>(null);
  const isDeletingCategory = deleteCategoryMutation.isPending;

  const deleteProductMutation = useDeleteProduct();
  const [openDeleteProductDialog, setOpenDeleteProductDialog] =
    useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState<any>(null);
  const isDeletingProduct = deleteProductMutation.isPending;

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
      {!showEmptyState && (
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
      )}
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
      {showEmptyState && (
        <EmptyProducts businessName={homePageData?.business_name} />
      )}
      {!showEmptyState && categoriesWithProducts?.results.map((cat) => (
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
          onProductDeleteClick={(product) => {
            setSelectedProductToDelete(product);
            setOpenDeleteProductDialog(true);
          }}
          onProductMoveClick={(product, currentCategory) => {
            setSelectedMoveProduct(product);
            setSelectedMoveCurrentCategory(currentCategory);
            setOpenMoveModal(true);
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
      <ConfirmationDialog
        open={Boolean(openDeleteProductDialog)}
        title={"Eliminar producto"}
        content={
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={4}
          >
            <WarningIcon color="warning" fontSize="large" />
            <Typography variant="body2" fontSize={"medium"}>
              ¿Deseas eliminar el producto
              {selectedProductToDelete
                ? ` "${selectedProductToDelete.name}"`
                : ""}
              ? Esta acción no se puede deshacer.
            </Typography>
          </Box>
        }
        onClose={() => {
          if (!isDeletingProduct) {
            setOpenDeleteProductDialog(false);
            setSelectedProductToDelete(null);
          }
        }}
        onConfirm={() => {
          if (!selectedProductToDelete) return;
          deleteProductMutation.mutate(Number(selectedProductToDelete.id), {
            onSuccess: () => {
              setOpenDeleteProductDialog(false);
              setSelectedProductToDelete(null);
            },
            onError: () => {
              setOpenDeleteProductDialog(false);
            },
          });
        }}
        isLoading={Boolean(isDeletingProduct)}
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
      <MoveToCategoryModal
        open={openMoveModal}
        product={selectedMoveProduct}
        currentCategory={selectedMoveCurrentCategory}
        onClose={() => {
          setOpenMoveModal(false);
          setSelectedMoveProduct(null);
          setSelectedMoveCurrentCategory(null);
        }}
      />
    </Box>
  );
};
