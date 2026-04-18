import { Box, Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import useProductDetail from "../../hooks/useProductDetail";
import ProductAddonsList from "./components/ProductAddonsList";
import ProductDetailGallery from "./components/ProductDetailGallery";
import ProductDetailInfo from "./components/ProductDetailInfo";
import ProductDetailPricing from "./components/ProductDetailPricing";
import ProductVariantsList from "./components/ProductVariantsList";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : undefined;
  const { data: product, isLoading, error } = useProductDetail(numericId);

  if (isLoading) {
    return <LoadingSpinner message="Cargando producto..." />;
  }

  if (error || !product) {
    return (
      <Box p={3}>
        <p>Error al cargar el producto.</p>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          px: 3,
          mt: 16,
          mx: "auto",
          minWidth: "85%",
        }}
      >
        <Grid container spacing={5}>
          {/* COLUMN 1 */}
          <Grid
            item
            xs={12}
            md={4}
            lg={5}
            sx={{ display: "flex", alignItems: "flex-start" }}
          >
            <ProductDetailGallery product={product} />
          </Grid>
          {/* COLUMN 2 */}
          <Grid item xs={12} md={8} lg={7}>
            <Box sx={{ p: 3, mb: 3 }}>
              <ProductDetailInfo product={product} />

              <ProductDetailPricing product={product} />
            </Box>

            {product.variants.length > 0 && (
              <Box sx={{ p: 3, mb: 3 }}>
                <ProductVariantsList variants={product.variants} />
              </Box>
            )}
            {product.addons.length > 0 && (
              <Box sx={{ p: 3 }}>
                <ProductAddonsList addons={product.addons} />
              </Box>
            )}

            {/* Related products / category list placeholder */}
            {/* <Box sx={{ mt: 6 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {product.category?.name ?? "Nombre de categoría"}
              </Typography> */}
            {/* TODO: reuse ProductCard carousel or grid here when data available */}
            {/* </Box> */}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
