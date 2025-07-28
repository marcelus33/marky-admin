import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  IconButton,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import XButton from "../../../components/XButton";
import CancelButton from "../../../components/CancelButton";

// Define un tipo para las categorías
export interface Category {
  id: string;
  label: string;
}

// Datos dummy para las categorías disponibles
const dummyCategories: Category[] = [
  { id: "cat1", label: "Categoría 1" },
  { id: "cat2", label: "Categoría 2" },
  { id: "cat3", label: "Categoría 3" },
  { id: "cat4", label: "Categoría 4" },
  { id: "cat5", label: "Categoría 5" },
  { id: "cat6", label: "Categoría 6" },
  { id: "cat7", label: "Categoría 7" },
];

interface CategoryFilterModalProps {
  open: boolean;
  onClose: () => void;
  initialSelectedCategories: Category[];
  onSubmit: (selectedCategories: Category[]) => void;
}

const CategoryFilterModal: React.FC<CategoryFilterModalProps> = ({
  open,
  onClose,
  initialSelectedCategories,
  onSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra las categorías disponibles según el término de búsqueda
  const filteredCategories = dummyCategories.filter((cat) =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      >
        <Box display={"flex"}>
          <DialogTitle>Filtrar Categorías</DialogTitle>
        </Box>
        <Box display={"flex"} sx={{ paddingY: 3 }}>
          <XButton onClick={onClose} sx={{ marginRight: 2 }} />
        </Box>
      </Box>
      <Formik
        initialValues={{
          selectedCategories: initialSelectedCategories,
        }}
        validationSchema={Yup.object({
          selectedCategories: Yup.array()
            .min(1, "Debes seleccionar al menos una categoría")
            .required("Debes seleccionar al menos una categoría"),
        })}
        onSubmit={(values) => {
          onSubmit(values.selectedCategories);
          onClose();
        }}
      >
        {({ values, setFieldValue, isValid, dirty }) => (
          <Form>
            <DialogContent sx={{ paddingX: 0, paddingY: 0 }}>
              <Box
                display="flex"
                gap={2}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                {/* Columna Izquierda: Lista de categorías disponibles */}
                <Box flex={1} py={4} pl={6} pr={1} pt={7}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar categoría..."
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ paddingRight: { xs: 4, md: 2 } }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Typography variant="subtitle2" sx={{ mt: 4, mb: 1 }}>
                    Categorías
                  </Typography>
                  <Box
                    sx={{
                      minHeight: 300,
                      overflowY: "auto",
                      // border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      p: 1,
                      display: "flex",
                      flexDirection: "column", // Para que se apilen verticalmente
                      gap: 1, // Espaciado entre items
                    }}
                  >
                    {filteredCategories.map((cat) => {
                      const isChecked = values.selectedCategories.some(
                        (c: Category) => c.id === cat.id
                      );
                      return (
                        <FormControlLabel
                          key={cat.id}
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Agrega la categoría si no está presente
                                  setFieldValue("selectedCategories", [
                                    ...values.selectedCategories,
                                    cat,
                                  ]);
                                } else {
                                  // Remueve la categoría
                                  setFieldValue(
                                    "selectedCategories",
                                    values.selectedCategories.filter(
                                      (c: Category) => c.id !== cat.id
                                    )
                                  );
                                }
                              }}
                            />
                          }
                          label={cat.label}
                        />
                      );
                    })}
                  </Box>
                </Box>

                {/* Columna Derecha: Lista de categorías seleccionadas */}
                <Box
                  flex={1}
                  py={4}
                  px={6}
                  pt={6}
                  sx={{
                    backgroundColor: "grey.100",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Categorías seleccionadas
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mb: 2, display: "block", color: "grey.500" }}
                  >
                    Puede eliminar o agregar categorías según el tipo de
                    búsqueda que desea visualizar.
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 300,
                      overflowY: "auto",
                      // border: "1px solid #e0e0e0",
                      // borderRadius: 1,
                      p: 3,
                    }}
                  >
                    {values.selectedCategories.length > 0 ? (
                      values.selectedCategories.map(
                        (cat: Category, i: number) => (
                          <Box
                            key={cat.id}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              mb: 1,
                              p: 1,
                              // borderBottom: "1px solid #e0e0e0",
                              "&:last-child": { borderBottom: "none" },
                            }}
                          >
                            <Typography>{cat.label}</Typography>
                            <IconButton
                              onClick={() =>
                                setFieldValue(
                                  "selectedCategories",
                                  values.selectedCategories.filter(
                                    (c: Category) => c.id !== cat.id
                                  )
                                )
                              }
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )
                      )
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No hay categorías seleccionadas.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                borderTop: "1px solid lightgrey",
                display: "flex",
                gap: 2,
                padding: 4,
              }}
            >
              <CancelButton
                sx={{ paddingX: 4, display: { xs: "none", md: "block" } }}
                onClick={onClose}
              >
                Cancelar
              </CancelButton>
              <Button
                disabled={!isValid || !dirty}
                sx={{
                  paddingX: 4,
                  boxShadow: 0,
                  width: { xs: "100%", md: "inherit" },
                }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Aplicar
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CategoryFilterModal;
