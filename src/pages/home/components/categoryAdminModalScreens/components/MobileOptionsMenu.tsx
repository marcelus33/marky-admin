import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";

interface Props {
  onPromo: () => void;
  onDelete: () => void;
}

const MobileOptionsMenu: React.FC<Props> = ({ onPromo, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              p: 1,
              boxShadow: "1px 2px 3.5px rgba(194,194,194,0.6)",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onPromo();
            handleClose();
          }}
          sx={{
            borderRadius: 1.5,
            gap: 1.5,
            "&:hover": { bgcolor: "#FAFAFA" },
          }}
        >
          <LocalOfferIcon fontSize="small" sx={{ color: "#4F4F4F" }} />
          <Typography sx={{ fontSize: 14, color: "#4F4F4F" }}>
            Promo
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
          sx={{ borderRadius: 1.5, gap: 1.5 }}
        >
          <DeleteIcon fontSize="small" sx={{ color: "#FF3E3E" }} />
          <Typography sx={{ fontSize: 14, color: "#FF3E3E" }}>
            Eliminar
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MobileOptionsMenu;
