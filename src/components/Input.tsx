// Input.tsx
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface InputProps {
  label: string;
  type?: string;
  required?: boolean;
  error?: boolean;
  maxLength?: number;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  name?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // opcional
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // opcional
  sx?: object;
  InputProps?: object; // New prop for TextField's InputProps
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  required = false,
  error = false,
  helperText,
  maxLength,
  disabled = false,
  placeholder,
  value,
  name,
  multiline,
  rows,
  maxRows,
  onChange,
  onBlur,
  sx,
  InputProps: customInputProps, // Destructure InputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const endAdornmentElements = (
    <>
      {type === "password" && (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      )}
      {maxLength !== undefined && (
        <InputAdornment position="end">
          <Typography variant="caption" color="textSecondary">
            {maxLength - (value?.length || 0)}
          </Typography>
        </InputAdornment>
      )}
    </>
  );

  return (
    <FormControl fullWidth error={error} disabled={disabled} sx={sx}>
      <FormLabel>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={showPassword ? "text" : type}
        variant="outlined"
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        fullWidth
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        InputProps={{
          endAdornment: endAdornmentElements,
          ...customInputProps, // Spread customInputProps here
        }}
        inputProps={{
          ...(maxLength ? { maxLength } : {}),
        }}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Input;
