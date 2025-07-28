import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";

interface Props {
  onPromo: () => void;
  onDelete: () => void;
  hasPromo?: boolean;
}

const MobileOptionsMenu: React.FC<Props> = ({
  onPromo,
  onDelete,
  hasPromo,
}) => {
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
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            onPromo();
            handleClose();
          }}
        >
          <LocalOfferIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography>Promo {hasPromo && "(activa)"}</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography color="error">Eliminar</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MobileOptionsMenu;
