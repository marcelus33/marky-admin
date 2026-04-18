import { ArrowBack } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
import { FormikProps } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../types/product";
import { useUpdateProductAvailability } from "../../product/../../hooks/useProductMutations";

interface ProductFormHeaderProps {
  formik: FormikProps<Product>;
  onDeleteClick?: () => void;
  onDuplicateClick?: () => void;
  onBack?: () => void;
}

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  formik,
  onDeleteClick,
  onDuplicateClick,
  onBack,
}) => {
  const updateAvailability = useUpdateProductAvailability();
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
        <Box
          sx={{
            padding: 1,
            backgroundColor: "grey.400",
            borderRadius: 2,
            ml: { xs: 2, md: 0 },
          }}
        >
          <IconButton onClick={() => (onBack ? onBack() : navigate(-1))}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography variant="h2" fontWeight="bold" sx={{ ml: 2 }}>
          Configuración
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              // bind to is_available; keep is_active in sync for backward compatibility
              checked={Boolean(
                formik.values.is_available ?? formik.values.is_active,
              )}
              disabled={(updateAvailability as any).isLoading}
              onChange={async (e) => {
                const checked = e.target.checked;
                // keep previous value to restore on error
                const previous = Boolean(
                  formik.values.is_available ?? formik.values.is_active,
                );

                // optimistic update to formik (only the field changed)
                formik.setFieldValue("is_available", checked);

                // if editing an existing product, call API to persist only availability
                const id = (formik.values as any).id;
                if (id) {
                  const fd = new FormData();
                  // persist only the is_available field on the backend
                  fd.append("is_available", checked ? "true" : "false");
                  try {
                    await updateAvailability.mutateAsync({ id, product: fd });
                  } catch (err) {
                    // revert optimistic update
                    formik.setFieldValue("is_available", previous);
                    formik.setFieldValue("is_active", previous);
                  }
                }
              }}
              name="is_available"
            />
          }
          label="Disponible"
        />
        <IconButton
          onClick={handleMenuClick}
          sx={{
            borderRadius: 2,
            backgroundColor: "grey.100",
          }}
        >
          <MoreVertIcon />
        </IconButton>
        {/*  */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              marginTop: 2,
              backgroundColor: "white", // light custom background
              p: 2, // inner padding
              maxWidth: 220, // optional, for spacing
            },
          }}
        >
          {formik.values && (formik.values as any).id ? (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onDuplicateClick?.();
              }}
              sx={{
                borderRadius: 2,
                p: 3,
                display: "flex",
                gap: 4,
              }}
            >
              <LocalOfferIcon fontSize="medium" />
              <Typography>Duplicar producto</Typography>
            </MenuItem>
          ) : null}
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDeleteClick?.();
            }}
            sx={{
              borderRadius: 2,
              p: 3,
              display: "flex",
              gap: 4,
            }}
          >
            <DeleteIcon fontSize="medium" />
            <Typography color="error">Eliminar producto</Typography>
          </MenuItem>

          <Divider />

          <Box px={2} py={1}>
            <FormControlLabel
              control={
                <Checkbox
                  // checked when product is hidden (is_active === false)
                  checked={!formik.values.is_active}
                  disabled={(updateAvailability as any).isLoading}
                  onChange={async (e) => {
                    const checked = e.target.checked; // checked === true means "hide"
                    const previous = Boolean(formik.values.is_active);

                    const newIsActive = !checked; // hide => is_active = false

                    // optimistic update locally (only is_active)
                    formik.setFieldValue("is_active", newIsActive);

                    const id = (formik.values as any).id;
                    if (id) {
                      const fd = new FormData();
                      // persist only the is_active field on the backend
                      fd.append("is_active", newIsActive ? "true" : "false");
                      try {
                        await updateAvailability.mutateAsync({
                          id,
                          product: fd,
                        });
                      } catch (err) {
                        // revert optimistic update on error
                        formik.setFieldValue("is_active", previous);
                        formik.setFieldValue("is_available", previous);
                      }
                    }
                  }}
                />
              }
              label={<Typography variant="body2">Ocultar producto</Typography>}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 28, // Bigger checkbox
                  borderRadius: 6, // Rounded corners (not fully circular)
                },
              }}
            />
            <Box>
              <Typography variant="caption" color="textDisabled">
                Al marcar esta opción, el producto se ocultará a sus comensales.
                Tu si podrás verlo.
              </Typography>
            </Box>
          </Box>
        </Menu>
        {/*  */}
      </Box>
    </Box>
  );
};

export default ProductFormHeader;
