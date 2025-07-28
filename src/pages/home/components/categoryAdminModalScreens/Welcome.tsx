import { Box, Typography, Button } from "@mui/material";
import AdminCategoriesImage from "../../../../assets/images/admin-categories.png";

type ActiveScreen = "welcome" | "main" | "sort" | "createEdit" | "promotion";

interface WelcomeProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ setActiveScreen }) => {
  return (
    <Box textAlign="center" py={4}>
      <img
        src={AdminCategoriesImage}
        alt="Canales de bienvenida"
        // width={120}
        style={{ marginBottom: 16 }}
      />
      <Typography variant="h6" gutterBottom>
        Crea tus categorías
      </Typography>
      <Typography
        color="textSecondary"
        variant="body2"
        sx={{ color: "grey.500" }}
      >
        Organiza tus productos relacionados
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setActiveScreen("createEdit")}
        sx={{ paddingX: 4, boxShadow: 0, mt: 8 }}
      >
        Crear categoría
      </Button>
    </Box>
  );
};
