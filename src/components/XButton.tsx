import React from "react";
import { styled, IconButtonProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const GreyHoverButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "transparent",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
  borderRadius: 5,
}));

// Extend IconButtonProps so our component inherits all the props
interface XButtonProps extends IconButtonProps {}

const XButton: React.FC<XButtonProps> = (props) => {
  return (
    <GreyHoverButton {...props}>
      <CloseIcon />
    </GreyHoverButton>
  );
};

export default XButton;
