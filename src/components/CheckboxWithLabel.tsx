// src/components/CheckboxWithLabel.tsx

import React from "react";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

interface CheckboxWithLabelProps {
  label: string | React.ReactNode;
  name?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UncheckedIcon = styled("span")({
  display: "inline-block",
  width: 22,
  height: 22,
  borderRadius: 4,
  border: "1px solid #AEB7C4",
  boxSizing: "border-box",
});

const CheckedIcon = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  borderRadius: 4,
  boxSizing: "border-box",
  backgroundColor: theme.palette.primary.main,
  "&::after": {
    content: '""',
    width: 12,
    height: 6,
    borderLeft: "2px solid #FFFFFF",
    borderBottom: "2px solid #FFFFFF",
    transform: "rotate(-45deg) translate(1px, -1px)",
  },
}));

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  label,
  name,
  checked,
  onChange,
}) => {
  const theme = useTheme();
  return (
    <FormControlLabel
      sx={{
        marginLeft: 0,
        gap: theme.spacing(2), // 8px
      }}
      control={
        <Checkbox
          size="medium"
          name={name}
          checked={checked}
          onChange={onChange}
          disableRipple
          sx={{ padding: 0 }}
          icon={<UncheckedIcon data-testid="checkbox-icon-unchecked" />}
          checkedIcon={<CheckedIcon data-testid="checkbox-icon-checked" />}
        />
      }
      label={<Typography variant="body2">{label}</Typography>}
    />
  );
};

export default CheckboxWithLabel;
