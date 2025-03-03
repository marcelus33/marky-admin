import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { FieldProps } from "formik";

interface CustomSelectProps extends FieldProps {
  label: string;
  required?: boolean;
  options: { value: string | number; label: string }[]; // opciones del select
  helperText?: string;
  sx: object;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  field,
  form,
  label,
  required = false,
  options = [],
  helperText,
  onChange,
  sx,
}) => {
  const { touched, errors } = form;
  const error = touched[field.name] && Boolean(errors[field.name]);

  return (
    <FormControl fullWidth error={error}>
      <FormLabel>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      <Select
        {...field}
        sx={sx}
        //@ts-ignore
        onChange={onChange}
        required={required}
        defaultValue=""
        variant="outlined"
        fullWidth
        error={error}
      >
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
