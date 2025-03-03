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
  type: string;
  required?: boolean;
  error?: boolean;
  maxLength?: number;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // opcional
  onBlur?: () => void; // opcional
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  required = false,
  error = false,
  helperText,
  maxLength,
  disabled = false,
  placeholder,
  value,
  onChange,
  onBlur,
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
    <FormControl fullWidth error={error} disabled={disabled}>
      <FormLabel>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      <TextField
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={showPassword ? "text" : type}
        variant="outlined"
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        fullWidth
        InputProps={{
          endAdornment: endAdornmentElements,
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
