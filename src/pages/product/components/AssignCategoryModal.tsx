import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import XButton from "../../../components/XButton";
import { Category } from "../../../types/category";
import useProductCategories from "../../../hooks/useProductCategories";
import { ProductCategory } from "../../../services/productService";
import ProductCategorySelectionList from "./ProductCategorySelectionList";

interface AssignCategoryModalProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

export const AssignCategoryModal: React.FC<AssignCategoryModalProps> = ({
  open,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
  const { data: categoriesData, isLoading } = useProductCategories(
    {
      include_products: false,
    },
    { enabled: open }
  );
  const [categories, setCategories] = useState<Category[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<Category | null>(
  //   null
  // );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignCategory = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory);
    }
  };

  useEffect(() => {
    if (categoriesData) {
      const mappedCategories: Category[] = categoriesData.results.map(
        (cat: ProductCategory) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          order: 0,
        })
      );
      setCategories(mappedCategories);
    }
  }, [categoriesData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <DialogTitle sx={{ p: 0 }}>Asignar categoría</DialogTitle>
        <XButton onClick={onClose} />
      </Box>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">
            Seleccione la categoría para su producto
          </Typography>
          <TextField
            fullWidth
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
            <ProductCategorySelectionList
              categories={filteredCategories}
              maxSelectable={1}
              selected={selectedCategory ? [selectedCategory] : []}
              setSelected={(cats: Category[]) =>
                // setSelectedCategory(cats[0] || null)
                onSelectCategory(cats[0] || null)
              }
            />
          </Box>
        </Box>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          p: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleAssignCategory}
          variant="contained"
          disabled={!selectedCategory}
        >
          Asignar categoría
        </Button>
      </Box>
    </Dialog>
  );
};

export default AssignCategoryModal;
