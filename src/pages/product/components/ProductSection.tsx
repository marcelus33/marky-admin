import React from "react";
import { Box, Typography, TextField, Grid } from "@mui/material";
import { Field, FormikProps } from "formik";
import NumberInput from "../../../components/NumberInput";
import CategorySelector from "./CategorySelector";
import { Category } from "../../../types/category";
import ProductImageGallery from "./ProductImageGallery"; // Import the new component
import { Product } from "../../../types/product";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ProductSectionProps {
  formik: FormikProps<Product>;
  onOpenModal: () => void;
  selectedCategory: Category | null;
}

const ProductSection = ({
  formik,
  onOpenModal,
  selectedCategory,
}: ProductSectionProps) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  return (
    <Box sx={{ width: "100%" }}>
      <ProductImageGallery />

      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: 5,
          mb: 3,
          mt: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <VisibilityIcon />
          <Typography variant="h6" fontWeight="bold">
            Información
          </Typography>
        </Box>
        <Field
          as={TextField}
          name="name"
          label="Nombre del producto"
          fullWidth
          margin="normal"
          required
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
        <Field
          as={TextField}
          name="description"
          label="Descripción"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && errors.description}
        />
        <Field
          name="price"
          component={NumberInput}
          label="Precio"
          required
          fullWidth
          margin="normal"
          error={touched.price && Boolean(errors.price)}
          helperText={touched.price && errors.price}
        />
      </Box>

      <CategorySelector
        selectedCategory={selectedCategory}
        onOpenModal={onOpenModal}
      />
    </Box>
  );
};

export default ProductSection;
