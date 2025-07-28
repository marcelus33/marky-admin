import AppsIcon from "@mui/icons-material/Apps";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import { Box, Button, Typography } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useState } from "react";
import CategoryGroup from "../../../components/CategoryGroup";
import { dummyCategoriesWithProducts } from "../../../utils/dummyCategoryWithProducts";
import CategoryAdminModal from "./CategoryAdminModal";
import CategoryFilterModal, { Category } from "./CategoryFilterModal";
import FilterSection from "./FilterSection";

interface FilterValues {
  search: string;
  categories: Category[];
  offer: string;
}

export const ProductGrid: React.FC = () => {
  const initialValues: FilterValues = {
    search: "",
    categories: [],
    offer: "",
  };

  const handleSubmit = (values: FilterValues) => {
    console.log("Filter values:", values);
    // Aquí llamarías a la API para filtrar productos o actualizar la grilla
  };

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openCategoryAdminModal, setOpenCategoryAdminModal] = useState(false);

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
            variant="contained"
            color="secondary"
            sx={{
              width: { xs: "100%", md: "auto" },
              padding: "8px 12px 8px 12px",
              backgroundColor: "#EDEDED",
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
      <Box
        mb={2}
        display="flex"
        flexWrap="wrap"
        gap={2}
        // sx={{ border: "2px solid red" }}
      >
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({
            values,
            handleChange,
            setFieldValue,
          }: FormikProps<FilterValues>) => (
            <Form style={{ width: "100%" }}>
              <FilterSection
                values={values}
                handleChange={handleChange}
                setOpenCategoryModal={() => setOpenCategoryModal(true)}
              />

              {/* Modal de filtrado de categorías */}
              <CategoryFilterModal
                open={openCategoryModal}
                onClose={() => setOpenCategoryModal(false)}
                initialSelectedCategories={values.categories}
                onSubmit={(categories: Category[]) => {
                  // Actualiza el campo de categoría en Formik
                  setFieldValue("categories", categories);
                }}
              />
              {/*  */}
              <CategoryAdminModal
                open={openCategoryAdminModal}
                onClose={() => setOpenCategoryAdminModal(false)}
              />
            </Form>
          )}
        </Formik>
      </Box>
      {/* Cuadrícula de productos */}
      {dummyCategoriesWithProducts.map((cat) => (
        <CategoryGroup
          key={cat.id}
          category={cat}
          onPromotionClick={() => console.log("Promo clicked:", cat.name)}
          onDeleteCategory={() => console.log("Delete:", cat.name)}
          onToggleAvailability={(checked) =>
            console.log("Unavailable toggle:", checked, cat.name)
          }
        />
      ))}
    </Box>
  );
};
