import { ArrowDropDown } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from "@mui/material";
import { useField } from "formik";
import React from "react";
import colors from "../themes/utils/colors";

interface SelectButtonFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  displayText?: string;
  required?: boolean;
  onClick: () => void;
  sx?: object;
  error?: boolean;
  helperText?: string;
}

const SelectButtonField: React.FC<SelectButtonFieldProps> = ({
  name,
  label,
  displayText,
  placeholder = "Seleccione una opción",
  required = false,
  onClick,
  sx = {},
  helperText,
}) => {
  const [field, meta] = useField(name);

  return (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      {label && (
        <FormLabel>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </FormLabel>
      )}
      <Button
        onClick={onClick}
        // variant="outlined"
        fullWidth
        sx={{
          justifyContent: "space-between",
          textTransform: "none",
          border: "1px solid",
          borderColor: "grey.800",
          ...sx,
        }}
      >
        <Typography color={displayText ? "black" : "grey"}>
          {displayText || placeholder}
        </Typography>
        <ArrowDropDown sx={{ color: "black" }} />
      </Button>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectButtonField;
