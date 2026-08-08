import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/paths";
import EmptyProductsImage from "../../../assets/images/producto_sin_imagenes.png";

interface EmptyProductsProps {
  businessName?: string;
}

const EmptyProducts: React.FC<EmptyProductsProps> = ({ businessName }) => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={8}>
      <img
        src={EmptyProductsImage}
        alt="Tu catálogo comienza aquí"
        style={{ maxWidth: 280, width: "100%", marginBottom: 16 }}
      />
      <Typography variant="h6" gutterBottom>
        {businessName
          ? `${businessName}, tu catálogo comienza aquí`
          : "Tu catálogo comienza aquí"}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body2"
        sx={{ color: "grey.500" }}
      >
        Agrega tu primer producto para empezar a mostrar tu propuesta
        gastronómica.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(ROUTES.PRODUCT_CREATE)}
        sx={{ paddingX: 4, boxShadow: 0, mt: 4 }}
      >
        Agregar mi primer producto
      </Button>
    </Box>
  );
};

export default EmptyProducts;
