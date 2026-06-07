import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import categoryIcons from "../../../../assets/icons/category/categoryIcons";
import SearchIcon from "@mui/icons-material/Search";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import WarningIcon from "@mui/icons-material/Warning";
import { ReactComponent as CrownIcon } from "../../../../assets/icons/crown.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Category } from "../../../../types/category";
import { useState } from "react";
import MobileOptionsMenu from "./components/MobileOptionsMenu";
import useDeleteProductCategory from "../../../../hooks/useDeleteProductCategory";

interface CategoryItemProps {
  cat: Category;
  setCategoryForm: (cat: Category) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  setOpenDeleteCategoryDialog: (open: boolean) => void;
  setSelectedCategoryDelete: (cat: Category) => void;
  isSortable?: boolean;
  isEditable?: boolean;
  setSelectedPromotionCategory: (cat: Category) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  cat,
  setCategoryForm,
  setActiveScreen,
  setOpenDeleteCategoryDialog,
  setSelectedCategoryDelete,
  isSortable = false,
  isEditable = true,
  setSelectedPromotionCategory,
}) => {
  const IconComponent =
    cat.icon && categoryIcons[cat.icon] ? categoryIcons[cat.icon] : null;

  return (
    <Box
      key={cat.id}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      pb={2}
      pt={1}
      px={3}
      mb={1}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        borderRadius: 1,
        width: "100%",
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {isSortable && (
          <Typography variant="body2" sx={{ cursor: "grab" }}>
            <DragIndicatorIcon />
          </Typography>
        )}
        <Box
          sx={{
            backgroundColor: "grey.600",
            p: 1,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: 2,
          }}
        >
          {IconComponent ? (
            <IconComponent fontSize="small" />
          ) : (
            <CrownIcon fontSize="small" />
          )}
        </Box>
        <Typography
          variant="body1"
          sx={{ cursor: "pointer", paddingBottom: 1 }}
          onClick={() => {
            setCategoryForm(cat);
            setActiveScreen("createEdit");
          }}
        >
          {cat.label}
        </Typography>
      </Box>

      {isEditable && (
        <Box display="flex" alignItems="center" gap={1}>
          {/* Show inline buttons on desktop */}
          <Box display={{ xs: "none", sm: "flex" }} alignItems="center" gap={1}>
            <IconButton
              onClick={() => {
                setActiveScreen("promotion");
                setSelectedPromotionCategory(cat);
              }}
              size="small"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <LocalOfferIcon
                  fontSize="small"
                  color={
                    cat.multibuyOption || (cat.discountPercentage || 0) > 0
                      ? "error"
                      : "inherit"
                  }
                />
                {(cat.multibuyOption || (cat.discountPercentage || 0) > 0) && (
                  <Typography variant="body2" color="error">
                    Promo activa
                  </Typography>
                )}
              </Box>
            </IconButton>
            <IconButton
              onClick={() => {
                setOpenDeleteCategoryDialog(true);
                setSelectedCategoryDelete(cat);
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Show menu icon on mobile */}
          <Box display={{ xs: "flex", sm: "none" }}>
            <MobileOptionsMenu
              onPromo={() => {
                setActiveScreen("promotion");
                setSelectedPromotionCategory(cat);
              }}
              onDelete={() => {
                setOpenDeleteCategoryDialog(true);
                setSelectedCategoryDelete(cat);
              }}
              hasPromo={
                !!(cat.multibuyOption || (cat.discountPercentage || 0) > 0)
              }
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

type ActiveScreen = "welcome" | "main" | "sort" | "createEdit" | "promotion";

interface MainProps {
  categories: Category[];
  isLoading: boolean;
  setActiveScreen: (screen: ActiveScreen) => void;
  setCategoryForm: (cat: Category | null) => void;
  onDeleteCategory: (cat: Category) => void;
  setSelectedPromotionCategory: (cat: Category) => void;
  onSelectCategory?: (category: Category) => void;
}

export const Main: React.FC<MainProps> = ({
  categories,
  isLoading,
  setActiveScreen,
  setCategoryForm,
  onDeleteCategory,
  setSelectedPromotionCategory,
  onSelectCategory,
}) => {
  const deleteProductCategory = useDeleteProductCategory();
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] =
    useState(false);
  const [selectedCategoryDelete, setSelectedCategoryDelete] =
    useState<Category>();

  return (
    <Box sx={{ marginBottom: 4 }}>
      {/* Filtros y botón para crear categoría */}
      <Box
        display="flex"
        alignItems="center"
        gap={4}
        mb={2}
        // sx={{ border: "1px solid blue" }}
      >
        <TextField
          sx={{ flex: 3 }}
          placeholder="Buscar categoría..."
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            style: { padding: "5px 0px 5px 8px" },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          // Aquí podrías manejar el onChange para filtrar la lista
        />
        <Button
          sx={{ flex: 1, boxShadow: 0 }}
          variant="contained"
          color="primary"
          onClick={() => {
            setActiveScreen("createEdit");
            setCategoryForm(null);
          }}
        >
          Crear categoría
        </Button>
      </Box>
      <Box
        display={"flex"}
        alignItems={"end"}
        justifyContent={"end"}
        sx={{ width: "100%" }}
      >
        <Button
          startIcon={<MoveDownIcon />}
          onClick={() => setActiveScreen("sort")}
        >
          Ordenar categorías
        </Button>
      </Box>
      {/* Lista de categorías creadas */}
      <Typography variant="subtitle2" mb={2}>
        Categorías creadas
      </Typography>
      <Box
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          border: 1,
          borderColor: "grey.600",
          paddingY: 1,
          borderRadius: 1,
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : categories && categories.length > 0 ? (
          categories.map((cat: Category) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CategoryItem
                key={cat.id}
                cat={cat}
                setCategoryForm={setCategoryForm}
                setActiveScreen={setActiveScreen}
                setOpenDeleteCategoryDialog={setOpenDeleteCategoryDialog}
                setSelectedCategoryDelete={setSelectedCategoryDelete}
                setSelectedPromotionCategory={setSelectedPromotionCategory}
              />
              {onSelectCategory && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onSelectCategory(cat)}
                >
                  Seleccionar
                </Button>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No hay categorías creadas.
          </Typography>
        )}
      </Box>
      {/* modal de confirmacion de borrar categoria */}
      <ConfirmationDialog
        onConfirm={() => {
          if (selectedCategoryDelete) {
            deleteProductCategory.mutate(selectedCategoryDelete.id as number, {
              onSuccess: () => {
                setOpenDeleteCategoryDialog(false);
                setSelectedCategoryDelete(undefined);
              },
            });
          }
        }}
        title={"Categoría"}
        open={openDeleteCategoryDialog}
        onClose={() => setOpenDeleteCategoryDialog(false)}
        content={
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={4}
          >
            <WarningIcon color="warning" fontSize="large" />
            <Typography variant="body2" fontSize={"medium"}>
              ¿Desea eliminar la categoría?
            </Typography>
          </Box>
        }
      />
    </Box>
  );
};
