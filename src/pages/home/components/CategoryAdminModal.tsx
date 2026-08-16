import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import XButton from "../../../components/XButton";
import useProductCategories from "../../../hooks/useProductCategories";
import useUpdateProductCategoryOrder from "../../../hooks/useUpdateProductCategoryOrder";
import { ProductCategory } from "../../../services/productService";
import { Category } from "../../../types/category";
import { CreateEdit } from "./categoryAdminModalScreens/CreateEdit";
import { Main } from "./categoryAdminModalScreens/Main";
import { Promotion } from "./categoryAdminModalScreens/Promotion";
import { Welcome } from "./categoryAdminModalScreens/Welcome";
import SortableCategoryList from "./SortableCategoryList";

type ActiveScreen = "welcome" | "main" | "sort" | "createEdit" | "promotion";

interface CategoryAdminModalProps {
  open: boolean;
  onClose: (orderChanged: boolean) => void;
}

export const CategoryAdminModal: React.FC<CategoryAdminModalProps> = ({
  open,
  onClose,
}) => {
  const { data: categoriesData, isLoading } = useProductCategories(
    {
      include_products: false,
    },
    { enabled: open },
  );
  const updateProductCategoryOrder = useUpdateProductCategoryOrder();
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("main");
  const [categoryForm, setCategoryForm] = useState<Category | null>(null);
  const [selectedPromotionCategory, setSelectedPromotionCategory] =
    useState<Category>();
  const goBack = () => setActiveScreen("main");

  const handleModalClose = () => {
    onClose(hasOrderChanged);
    setActiveScreen("main");
    setHasOrderChanged(false);
  };

  const handleCreateEditSubmit = (
    cat: Partial<Category>,
    backScreen: boolean = true,
  ) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === cat.id);

      if (exists) {
        // Editar categoría existente
        return prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c));
      } else {
        // Agregar nueva categoría
        return [...prev, cat as Category];
      }
    });

    setCategoryForm(null);

    if (backScreen) {
      // Tanto al crear como al editar, vuelve al listado dentro del modal
      // para que el usuario tenga confirmación visual de que la categoría
      // (nueva o editada) quedó guardada.
      setActiveScreen("main");
    }
  };

  const onDeleteCategory = (cat: any) => {
    // This is now handled by react-query optimistic updates
  };

  useEffect(() => {
    if (categoriesData) {
      const mappedCategories = categoriesData.results.map(
        (cat: ProductCategory) => ({
          id: cat.id,
          label: cat.name,
          icon: cat.icon,
          order: 0, // Default value
          hasOffer: !!cat.multibuy_option,
          multibuyOption: cat.multibuy_option ?? undefined,
          discountPercentage: parseFloat(cat.discount_percentage),
          promotionStartsAt: cat.promotion_starts_at ?? undefined,
          promotionEndsAt: cat.promotion_ends_at ?? undefined,
        }),
      );
      setCategories(mappedCategories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (
      open &&
      activeScreen === "main" &&
      !isLoading &&
      categories.length < 1
    ) {
      setActiveScreen("welcome");
    } else if (
      open &&
      activeScreen === "welcome" &&
      !isLoading &&
      categories.length > 0
    ) {
      setActiveScreen("main");
    }
  }, [categories, activeScreen, isLoading, open]);

  return (
    <Dialog open={open} onClose={handleModalClose} fullWidth maxWidth="md">
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderBottom: "1px solid lightgrey",
          }}
        >
          <Box display={"flex"}>
            <IconButton onClick={goBack}>
              <ArrowBackIcon sx={{ color: "black" }} />
            </IconButton>
            <DialogTitle>
              {["main", "welcome"].includes(activeScreen) &&
                "Administrar categorías"}
              {activeScreen === "sort" && "Ordenar categorías"}
              {activeScreen === "createEdit" &&
                `${categoryForm?.id ? "Editar" : "Nueva"} Categoría`}
              {activeScreen === "promotion" && "Promoción"}
            </DialogTitle>
          </Box>
          <Box display={"flex"} sx={{ paddingY: 3 }}>
            <XButton onClick={handleModalClose} sx={{ marginRight: 2 }} />
          </Box>
        </Box>
        {/* ========== MODAL CONTENT ========== */}
        <DialogContent>
          {/* WELCOME ========== */}
          {activeScreen === "welcome" && (
            <Welcome setActiveScreen={setActiveScreen} />
          )}
          {/* MAIN LIST ========== */}
          {activeScreen === "main" && (
            <Main
              categories={categories}
              isLoading={isLoading}
              setActiveScreen={setActiveScreen}
              setCategoryForm={setCategoryForm}
              onDeleteCategory={onDeleteCategory}
              setSelectedPromotionCategory={setSelectedPromotionCategory}
            />
          )}
          {/* ========== SORTABLE LIST ========== */}
          {activeScreen === "sort" && (
            <SortableCategoryList
              categories={categories}
              // setFieldValue={setFieldValue}
              setActiveScreen={setActiveScreen}
              // setOpenDeleteCategoryDialog={setOpenDeleteCategoryDialog}
              // setSelectedCategoryDelete={setSelectedCategoryDelete}
              isSortable={true}
              isEditable={false}
              onOrderChange={(orderedCategories) => {
                // Ensure `order` is always a number when sending to the API.
                // `Category.order` is optional in the type definitions, so
                // fall back to the current index if it's undefined.
                const payload = orderedCategories.map((cat, index) => ({
                  id: cat.id as number,
                  order: (cat.order ?? index) as number,
                }));

                updateProductCategoryOrder.mutate(payload, {
                  onSuccess: () => {
                    setCategories(orderedCategories);
                    setHasOrderChanged(true);
                    setActiveScreen("main");
                  },
                });
              }}
            />
          )}
          {/* ========== CREATE/EDIT FORM ========== */}
          {activeScreen === "createEdit" && (
            <CreateEdit
              key={categoryForm?.id ?? "new"}
              initialCategory={categoryForm}
              onSubmit={handleCreateEditSubmit}
            />
          )}
          {/* TODO: make this work ========== CATEGORY PROMOTION ========== */}
          {activeScreen === "promotion" && (
            <Promotion
              category={selectedPromotionCategory}
              onSubmit={(updatedCategory) => {
                setCategories((prev) =>
                  prev.map((c) =>
                    c.id === updatedCategory.id ? updatedCategory : c
                  )
                );
                setActiveScreen("main");
              }}
            />
          )}
        </DialogContent>
      </>
    </Dialog>
  );
};

export default CategoryAdminModal;
