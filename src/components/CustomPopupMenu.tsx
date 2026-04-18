import React from "react";
import { Menu, MenuItem, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface CustomPopupMenuItem {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg"> | any>;
  text: string;
  onClick: () => void;
}

interface CustomPopupMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  menuItems: CustomPopupMenuItem[];
}

const CustomPopupMenu: React.FC<CustomPopupMenuProps> = ({
  anchorEl,
  open,
  onClose,
  menuItems,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      // PaperProps={{
      //   sx: {
      //     "& .MuiMenuItem-root": {
      //       mb: 4,
      //       mt: 1,
      //     },
      //   },
      // }}
      PaperProps={{
        sx: {
          marginTop: 2,
          backgroundColor: "white", // light custom background
          p: 2, // inner padding
          maxWidth: 220, // optional, for spacing
        },
      }}
      sx={
        {
          // "& .MuiPaper-root": {
          //   backgroundColor: "background.default",
          //   borderRadius: 2,
          //   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          //   minWidth: 200,
          // },
          // "& .MuiMenuItem-root": {
          //   fontSize: "0.9rem",
          //   paddingY: 1,
          //   "&:hover": {
          //     backgroundColor: "#e0e0e0",
          //   },
          // },
        }
      }
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={item.onClick}
          sx={{
            borderRadius: 2,
            p: 3,
            display: "flex",
            gap: 4,
          }}
        >
          <item.icon fontSize="small" />
          {item.text}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default CustomPopupMenu;
