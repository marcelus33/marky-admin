import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  TextField,
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

  // Inicializa/sincroniza el displayValue a partir del valor almacenado en
  // Formik. IMPORTANTE: no debemos pisar lo que el usuario está escribiendo.
  // Cada `handleChange` llama a `form.setFieldValue`, lo que dispara este
  // efecto de nuevo con el `field.value` recién actualizado. Si simplemente
  // reformateáramos siempre, un valor intermedio como "15," (el usuario
  // acaba de escribir la coma decimal, todavía no el dígito decimal) se
  // reformatea a "15" porque `formatToDisplay` descarta una parte decimal
  // vacía — borrando la coma antes de que el usuario pueda escribir el
  // decimal. Por eso solo resincronizamos cuando el valor entrante
  // realmente representa un número distinto al que el usuario ya tiene
  // escrito en pantalla (cambios externos: carga inicial, edición de
  // producto, reset del formulario, etc.).
  useEffect(() => {
    setDisplayValue((prevDisplay) => {
      const prevRaw = formatToRaw(prevDisplay);
      const incoming = field.value ? String(field.value) : "";
      const sameRaw = prevRaw === incoming;
      const sameNumericValue =
        prevRaw !== "" &&
        incoming !== "" &&
        !isNaN(Number(prevRaw)) &&
        !isNaN(Number(incoming)) &&
        Number(prevRaw) === Number(incoming);
      if (sameRaw || sameNumericValue) {
        return prevDisplay;
      }
      return incoming ? formatToDisplay(incoming) : "";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newDisplay = e.target.value;
    // Permitir solo dígitos, puntos y comas
    newDisplay = newDisplay.replace(/[^0-9.,]/g, "");
    // Limitar a 2 decimales tras la coma (backend: DecimalField decimal_places=2)
    const [intPart, ...decParts] = newDisplay.split(",");
    if (decParts.length > 0) {
      newDisplay = `${intPart},${decParts.join("").slice(0, 2)}`;
    }
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
        error={Boolean(form.touched[field.name] && form.errors[field.name])}
        helperText={
          form.touched[field.name] && form.errors[field.name]
            ? String(form.errors[field.name])
            : helperText
        }
      />
    </FormControl>
  );
};

export default NumberInput;
