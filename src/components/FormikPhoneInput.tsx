import React from "react";
import { FieldProps } from "formik";
import { Box, Typography } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css"; // Asegúrate de importar los estilos necesarios para el PhoneInput
import { useTheme } from "@mui/material/styles";

interface FormikPhoneInputProps {
  label: string;
  name: string;
  placeholder?: string;
  country?: string;
  required?: boolean;
}

const FormikPhoneInput: React.FC<FormikPhoneInputProps & FieldProps> = ({
  label,
  field,
  required = false,
  form: { touched, errors },
  placeholder = "",
  country = "py",
}) => {
  const theme = useTheme();
  const error = touched[field.name] && errors[field.name];

  return (
    <Box sx={{ marginBottom: theme.spacing(4) }}>
      {/* Custom Label */}
      <Typography
        variant="body1"
        component="label"
        sx={{
          display: "block",
          marginBottom: theme.spacing(1),
          //@ts-ignore
          ...theme.components?.MuiFormLabel?.styleOverrides?.root,
        }}
      >
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Typography>
      <PhoneInput
        country={country}
        value={field.value}
        onChange={(phone) =>
          field.onChange({ target: { name: field.name, value: phone } })
        }
        specialLabel=""
        inputStyle={{
          width: "100%",
          color: theme.palette.text.primary,
          fontSize: theme.typography.body1.fontSize,
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.body1.fontWeight,
          borderColor: error
            ? theme.palette.error.main
            : theme.palette.grey[800],
          borderRadius: theme.shape.borderRadius,
        }}
        containerStyle={{
          width: "100%",
        }}
        placeholder={placeholder}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ marginLeft: "14px" }}>
          {errors[field.name] as string}
        </Typography>
      )}
    </Box>
  );
};

export default FormikPhoneInput;
