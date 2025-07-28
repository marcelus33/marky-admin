import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem as MuiMenuItem,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TikTokIcon from "@mui/icons-material/MusicNote"; // Usa un icono representativo para TikTok
import { ReactComponent as LogoMarkyBlack } from "../../../assets/icons/logo-marky-black.svg";

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
      position="static"
      color="transparent"
      elevation={0}
      sx={{ boxShadow: "0px 1px 0px 0px #E8E9EB" }}
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
          <Avatar src="https://via.placeholder.com/40" />
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
