import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FileCopy, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import { Product } from "../../../types/product";

interface ProductFormHeaderProps {
  formik: FormikProps<Product>;
}

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({ formik }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        my: 3,
        mx: { xs: 1, md: 10 },
        pb: 3,
        borderBottom: 1,
        borderColor: "grey.400",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ padding: 1, backgroundColor: "grey.400", borderRadius: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography variant="h2" fontWeight="bold">
          Configuración
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.is_active}
              onChange={(e) =>
                formik.setFieldValue("is_active", e.target.checked)
              }
              name="is_active"
            />
          }
          label="Disponible"
        />
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <FileCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicar producto</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>Eliminar producto</ListItemText>
          </MenuItem>
          <MenuItem onClick={(e) => e.stopPropagation()}>
            <FormControlLabel
              control={<Checkbox />}
              label="Ocultar producto"
              sx={{ pointerEvents: "none", ml: -1 }}
            />
          </MenuItem>
          <Typography variant="caption" sx={{ px: 2, color: "text.secondary" }}>
            Al marcar esta opción, el producto se ocultará a sus comensales. Tu
            sí podrás verlo.
          </Typography>
        </Menu>
      </Box>
    </Box>
  );
};

export default ProductFormHeader;
