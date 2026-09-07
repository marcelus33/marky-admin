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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      gap={3}
      sx={{
        border: "1px solid #E6E6E6",
        borderRadius: "13px",
        px: 3,
        py: 10,
      }}
    >
      <img
        src={EmptyProductsImage}
        alt="Tu catálogo comienza aquí"
        style={{ maxWidth: 273, width: "100%" }}
      />
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography sx={{ fontSize: 16, fontWeight: 500, color: "#292929" }}>
          {businessName
            ? `${businessName}, tu catálogo comienza aquí`
            : "Tu catálogo comienza aquí"}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
          Agrega tu primer producto para empezar a mostrar tu propuesta
          gastronómica.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(ROUTES.PRODUCT_CREATE)}
        sx={{ paddingX: 4, boxShadow: 0 }}
      >
        Agregar mi primer producto
      </Button>
    </Box>
  );
};

export default EmptyProducts;
