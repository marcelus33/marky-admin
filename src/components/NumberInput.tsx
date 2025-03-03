import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  TextField,
  FormHelperText,
  Typography,
  TextFieldProps,
} from "@mui/material";
import { FieldProps } from "formik";

const NumberInput: React.FC<
  FieldProps & {
    label: string;
    required?: boolean;
    helperText?: string;
    disabled?: boolean;
    placeholder?: string;
    description?: string;
    InputProps?: TextFieldProps["InputProps"];
  }
> = ({
  field,
  form,
  label,
  description,
  required = false,
  helperText,
  disabled = false,
  placeholder,
  InputProps,
}) => {
  // Estado local para el valor mostrado en el input (formateado en estilo LATAM)
  const [displayValue, setDisplayValue] = useState<string>("");

  // Función para formatear el valor "raw" (ej: "1234.56") al formato LATAM ("1.234,56")
  const formatToDisplay = (raw: string): string => {
    if (!raw) return "";
    const [intPart, decPart] = raw.split(".");
    // Agrega separadores de miles (puntos)
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return decPart ? `${formattedInt},${decPart}` : formattedInt;
  };

  // Función para convertir el valor en formato LATAM al formato "raw" (backend)
  const formatToRaw = (display: string): string => {
    // Remueve puntos (separador de miles) y reemplaza la coma decimal por un punto
    return display.replace(/\./g, "").replace(",", ".");
  };

  // Inicializa el displayValue a partir del valor almacenado en Formik
  useEffect(() => {
    setDisplayValue(field.value ? formatToDisplay(String(field.value)) : "");
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newDisplay = e.target.value;
    // Permitir solo dígitos, puntos y comas
    newDisplay = newDisplay.replace(/[^0-9.,]/g, "");
    setDisplayValue(newDisplay);
    const newRaw = formatToRaw(newDisplay);
    form.setFieldValue(field.name, newRaw);
  };

  const handleBlur = () => {
    form.setFieldTouched(field.name, true);
  };

  return (
    <FormControl
      fullWidth
      error={Boolean(form.touched[field.name] && form.errors[field.name])}
      disabled={disabled}
    >
      <FormLabel>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>

      {description && (
        <Typography
          id="modal-description"
          variant="body2"
          sx={{ mt: 2, mb: 1 }}
        >
          {description}
        </Typography>
      )}

      <TextField
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        variant="outlined"
        placeholder={placeholder}
        InputProps={{
          ...InputProps,
        }}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default NumberInput;
