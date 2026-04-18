import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import defaultUserAvatar from "../assets/images/user_default.png";

export const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        boxShadow: "0px 1px 0px 0px #E8E9EB",
        backgroundColor: "white",
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <LogoMarkyBlack
            style={{ height: 50, marginRight: theme.spacing(1) }}
          />
        </Box>
        <IconButton color="inherit">
          <NotificationsIcon sx={{ color: "#9E9EA6" }} />
        </IconButton>
        <IconButton color="inherit" onClick={handleProfileClick}>
          <Avatar src={defaultUserAvatar} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose(); /* Implement logout here */
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
