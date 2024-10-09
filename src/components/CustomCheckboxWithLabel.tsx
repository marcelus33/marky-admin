import React from "react";
// import { CheckboxWithLabel } from "formik-mui"; // Asegúrate de tener este componente
import { Box, Typography } from "@mui/material";
import { FieldInputProps, FieldMetaProps, FieldProps } from "formik";
import CheckboxWithLabel from "./CheckboxWithLabel";

interface CustomCheckboxWithLabelProps {
  label: React.ReactNode;
  field: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
}

const CustomCheckboxWithLabel: React.FC<CustomCheckboxWithLabelProps> = ({
  label,
  field,
  meta: { touched, error },
}) => {
  return (
    <Box>
      <CheckboxWithLabel
        name={field.name}
        label={label}
        checked={field.value}
        onChange={field.onChange}
      />
      {touched && error && (
        <Typography variant="body2" color="error" sx={{ marginLeft: "14px" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CustomCheckboxWithLabel;
