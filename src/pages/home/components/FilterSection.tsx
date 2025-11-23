import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SelectButtonField from "../../../components/SelectButtonField";

// Create a separate component for the filters section
const FilterSection: React.FC<{
  values: any;
  onFilterChange: (newFilters: any) => void;
  setOpenCategoryModal: () => void;
}> = ({ values, onFilterChange, setOpenCategoryModal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [values.search]);

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
            onChange={(e) => onFilterChange({ search: e.target.value })}
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
            <SelectButtonField
              placeholder="Categorías: Todas"
              displayText={
                values.categories?.length > 0
                  ? `Categorías: ${values.categories?.length} seleccionadas`
                  : undefined
              }
              onClick={setOpenCategoryModal}
              sx={{ padding: 2.5 }}
            />
            <FormControlLabel
              sx={{ whiteSpace: "nowrap" }}
              control={
                <Checkbox
                  checked={values.offer}
                  onChange={(e) => onFilterChange({ offer: e.target.checked })}
                  color="primary"
                />
              }
              label="En promoción"
            />
          </Box>
        )}
      </>
    );
  } else {
    return (
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            inputRef={searchInputRef}
            placeholder="Buscar por texto o SKU del producto"
            name="search"
            variant="outlined"
            size="small"
            value={values.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { paddingY: 2 },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SelectButtonField
            placeholder="Categorías: Todas"
            displayText={
              values.categories?.length > 0
                ? `Categorías: ${values.categories?.length} seleccionadas`
                : undefined
            }
            onClick={setOpenCategoryModal}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControlLabel
            sx={{ whiteSpace: "nowrap" }}
            control={
              <Checkbox
                checked={values.offer}
                onChange={(e) => onFilterChange({ offer: e.target.checked })}
                color="primary"
              />
            }
            label="En promoción"
          />
        </Grid>
      </Grid>
    );
  }
};

export default FilterSection;
