import { Box, Button, Typography } from "@mui/material";
import React from "react";
import channelsWelcomeImage from "../../../../assets/images/channels-welcome.png";

interface ChannelWelcomeStepProps {
  onStart: () => void;
}

const ChannelWelcomeStep: React.FC<ChannelWelcomeStepProps> = ({ onStart }) => (
  <Box textAlign="center" py={4}>
    <img
      src={channelsWelcomeImage}
      alt="Canales de bienvenida"
      style={{ marginBottom: 16 }}
    />
    <Typography variant="h6" gutterBottom>
      Canales de tu marca
    </Typography>
    <Typography
      color="textSecondary"
      variant="body2"
      sx={{ color: "grey.500" }}
    >
      Conecta con tu audiencia y atrae tráfico a tus estrategias de contenido
      mostrando tus redes sociales y canales de contacto.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={onStart}
      sx={{ paddingX: 4, boxShadow: 0, mt: 8 }}
    >
      Configurar canales
    </Button>
  </Box>
);

export default ChannelWelcomeStep;
