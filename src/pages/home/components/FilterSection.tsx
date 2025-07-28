import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Field } from "formik";
import SelectButtonField from "../../../components/SelectButtonField";
import { useTheme, useMediaQuery } from "@mui/material";
import { BorderClear } from "@mui/icons-material";

// Create a separate component for the filters section
const FilterSection: React.FC<{
  values: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  setOpenCategoryModal: () => void;
}> = ({ values, handleChange, setOpenCategoryModal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  if (isMobile) {
    return (
      <>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <TextField
            placeholder="Buscar por texto o SKU del producto"
            name="search"
            variant="outlined"
            size="small"
            value={values.search}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              // You can adjust the padding here as needed
              sx: { paddingY: 1.5 },
            }}
          />
          <IconButton
            onClick={handleToggleFilters}
            sx={{
              backgroundColor: "#EDEDED !important",
              borderRadius: 1,
              p: 3,
              color: showFilters ? "primary.main" : "inherit",
              "&:hover": {
                backgroundColor: "#EDEDED !important",
              },
              "&:active": {
                backgroundColor: "#EDEDED !important",
              },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>
        {showFilters && (
          <Box display="flex" flexDirection="column" gap={2} mb={2}>
            <Field
              name="categories"
              component={SelectButtonField}
              placeholder="Categorías: Todas"
              displayText={
                values.categories?.length > 0
                  ? `Categorías: ${values.categories?.length} seleccionadas`
                  : null
              }
              onClick={setOpenCategoryModal}
              sx={{ padding: 2.5 }}
            />
            <Field name="offer">
              {({ field }: any) => (
                <FormControlLabel
                  sx={{ whiteSpace: "nowrap" }}
                  control={<Checkbox {...field} color="primary" />}
                  label="En promoción"
                />
              )}
            </Field>
          </Box>
        )}
      </>
    );
  } else {
    return (
      <Box
        display="flex"
        gap={3}
        mb={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <TextField
          placeholder="Buscar por texto o SKU del producto"
          name="search"
          variant="outlined"
          size="small"
          value={values.search}
          onChange={handleChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              paddingY: 1.5,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.800",
              },
            },
          }}
        />
        <Field
          name="categories"
          component={SelectButtonField}
          placeholder="Categorías: Todas"
          displayText={
            values.categories?.length > 0
              ? `Categorías: ${values.categories?.length} seleccionadas`
              : null
          }
          onClick={setOpenCategoryModal}
          sx={{ padding: 3, borderColor: "grey.800" }}
        />
        <Field name="offer">
          {({ field }: any) => (
            <FormControlLabel
              sx={{ whiteSpace: "nowrap" }}
              control={<Checkbox {...field} color="primary" />}
              label="En promoción"
            />
          )}
        </Field>
      </Box>
    );
  }
};

export default FilterSection;
