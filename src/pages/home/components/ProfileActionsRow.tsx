import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CancelButton from "../../../components/CancelButton";

interface ProfileActionsRowProps {
  onEditProfile: () => void; // Abre el PresentationModal
  onSettings: () => void; // Función para configurar (futura)
}

const ProfileActionsRow: React.FC<ProfileActionsRowProps> = ({
  onEditProfile,
  onSettings,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center" gap={4} p={2}>
      <CancelButton sx={{ paddingX: 4, flex: 1 }} onClick={onEditProfile}>
        Editar Perfil
      </CancelButton>
      <IconButton
        onClick={onSettings}
        sx={{
          backgroundColor: "grey.200",
          borderRadius: 1,
          p: 3,
        }}
      >
        <SettingsIcon />
      </IconButton>
      <IconButton
        onClick={handleOpenMenu}
        sx={{
          backgroundColor: "grey.200",
          borderRadius: 1,
          p: 3,
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top", // se ancla en la parte superior del elemento
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom", // el menú se posiciona de modo que su parte inferior se alinee con el anchor
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            "& .MuiMenuItem-root": {
              mb: 4,
              mt: 1,
            },
          },
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "background.default", // color de fondo personalizado
            borderRadius: 2,
            // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            minWidth: 200,
          },
          "& .MuiMenuItem-root": {
            fontSize: "0.9rem",
            paddingY: 1,
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ShareIcon fontSize="small" sx={{ mr: 3 }} />
          Compartir perfil
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 3 }} />
          Copiar URL del perfil
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <QrCodeIcon fontSize="small" sx={{ mr: 3 }} />
          Código QR
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileActionsRow;
