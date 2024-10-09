// src/components/CheckboxWithLabel.tsx

import React from "react";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";

interface CheckboxWithLabelProps {
  label: string | React.ReactNode;
  name?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  label,
  name,
  checked,
  onChange,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="medium"
          name={name}
          checked={checked}
          onChange={onChange}
        />
      }
      label={<Typography variant="body2">{label}</Typography>}
    />
  );
};

export default CheckboxWithLabel;
