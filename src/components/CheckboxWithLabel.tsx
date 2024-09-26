// src/components/CheckboxWithLabel.tsx

import React from "react";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";

interface CheckboxWithLabelProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} />}
      label={<Typography variant="body2">{label}</Typography>}
    />
  );
};

export default CheckboxWithLabel;
