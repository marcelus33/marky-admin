import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Typography } from "@mui/material";
import { Field, FormikProps } from "formik";
import Input from "../../../components/Input";
import NumberInput from "../../../components/NumberInput";
import { Category } from "../../../types/category";
import { Product } from "../../../types/product";
import CategorySelector from "./CategorySelector";
import ProductImageGallery from "./ProductImageGallery"; // Import the new component

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
        <Input
          name="name"
          label="Nombre del producto"
          placeholder="Nombre del producto"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          sx={{ mt: 2 }}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name ? errors.name : undefined}
        />
        <Input
          name="description"
          label="Descripción"
          placeholder="Descripción"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          multiline
          rows={4}
          required
          sx={{ mt: 2 }}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description ? errors.description : undefined}
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
