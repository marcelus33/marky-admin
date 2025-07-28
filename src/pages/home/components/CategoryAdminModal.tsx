import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import categoryIcons from "../../../assets/icons/category/categoryIcons";
import { ReactComponent as CrownIcon } from "../../../assets/icons/crown.svg";
// import ConfirmationDialog from "../../../components/ConfirmationDialog";
import Input from "../../../components/Input";
import XButton from "../../../components/XButton";
import { Category } from "../../../types/category";
import { splitISODateTime } from "../../../utils/utils";
import { CreateEdit } from "./categoryAdminModalScreens/CreateEdit";
import { Promotion } from "./categoryAdminModalScreens/Promotion";
import { Main } from "./categoryAdminModalScreens/Main";
import { Welcome } from "./categoryAdminModalScreens/Welcome";
import SortableCategoryList from "./SortableCategoryList";
import { boolean } from "yup";
import useProductCategories from "../../../hooks/useProductCategories";
import {
  ProductCategory,
  ProductCategoryPayload,
} from "../../../services/productService";
import useUpdateProductCategoryOrder from "../../../hooks/useUpdateProductCategoryOrder";

interface CategoryAdminFormValues {
  // Pantalla principal
  // categories: Category[]; // Lista de categorías creadas
  search: string;
  // Subpantalla 1: Crear/Editar categoría
  newCategoryName: string;
  newCategoryIcon: string;
  editingCategoryId: string | number | null;
  // Subpantalla 2: Promoción
  promotionOption: "descuento" | "oferta" | "";
  isPromotionActive: boolean;
  discountPercentage: number | null;
  countdownActive: boolean;
  promotionDateStart: string;
  promotionTimeStart: string;
  promotionDateEnd: string;
  promotionTimeEnd: string;
}

const initialValues: CategoryAdminFormValues = {
  // categories: dummyCategories,
  // categories: [],
  search: "",
  //
  newCategoryName: "",
  newCategoryIcon: "",
  editingCategoryId: "",
  // promotion
  promotionOption: "",
  isPromotionActive: false,
  discountPercentage: null,
  countdownActive: false,
  promotionDateStart: "",
  promotionTimeStart: "",
  promotionDateEnd: "",
  promotionTimeEnd: "",
};

type ActiveScreen = "welcome" | "main" | "sort" | "createEdit" | "promotion";

interface CategoryAdminModalProps {
  open: boolean;
  onClose: () => void;
}

export const CategoryAdminModal: React.FC<CategoryAdminModalProps> = ({
  open,
  onClose,
}) => {
  const { data: categoriesData, isLoading } = useProductCategories(
    {
      include_products: false,
    },
    { enabled: open }
  );
  const updateProductCategoryOrder = useUpdateProductCategoryOrder();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("main");
  const [categoryForm, setCategoryForm] = useState<Category | null>(null);
  const [selectedPromotionCategory, setSelectedPromotionCategory] =
    useState<Category>();
  const goBack = () => setActiveScreen("main");

  const iconKeys = Object.keys(categoryIcons);

  const getIconComponent = (cat: Category) => {
    const IconComponent =
      cat.icon && categoryIcons[cat.icon] ? categoryIcons[cat.icon] : null;

    return IconComponent ? (
      <IconComponent fontSize="small" />
    ) : (
      <CrownIcon fontSize="small" />
    );
  };

  const handleCreateEditSubmit = (
    cat: Partial<Category>,
    backScreen: boolean = true
  ) => {
    console.log("handleCreateEditSubmit", cat);

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

    if (backScreen) {
      setActiveScreen("main");
    }

    setCategoryForm(null);
    console.log("handleCreateEditSubmit 2");

    // TODO: API CALL con toast de success o error
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
        })
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
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setActiveScreen("main");
      }}
      fullWidth
      maxWidth="md"
    >
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
            <XButton
              onClick={() => {
                onClose();
                setActiveScreen("main");
              }}
              sx={{ marginRight: 2 }}
            />
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
                const payload = orderedCategories.map((cat) => ({
                  id: cat.id as number,
                  order: cat.order,
                }));
                updateProductCategoryOrder.mutate(payload, {
                  onSuccess: () => {
                    setCategories(orderedCategories);
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
              onSubmit={() => {
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
