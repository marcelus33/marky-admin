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
import CustomPopupMenu from "../../../components/CustomPopupMenu";

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

  const menuItems = [
    { icon: ShareIcon, text: "Compartir perfil", onClick: handleCloseMenu },
    {
      icon: ContentCopyIcon,
      text: "Copiar URL del perfil",
      onClick: handleCloseMenu,
    },
    { icon: QrCodeIcon, text: "Código QR", onClick: handleCloseMenu },
  ];

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
      <CustomPopupMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        menuItems={menuItems}
      />
    </Box>
  );
};

export default ProfileActionsRow;
