import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";
import defaultUserAvatar from "../assets/images/user_default.png";
import { useSessionStore } from "../stores/sessionStore";
import NotificationsMenu from "./NotificationsMenu";

export const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSessionStore();

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
        <NotificationsMenu />
        <IconButton
          color="inherit"
          onClick={handleProfileClick}
          aria-label="user-menu"
        >
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
          PaperProps={{
            sx: {
              minWidth: 260,
              px: 1,
              py: 2,
              backgroundColor: "white",
              borderRadius: 2,
            },
          }}
        >
          <Box sx={{ px: 4, pb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.business_name ?? user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.username}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            sx={{ p: 4 }}
            onClick={() => {
              handleClose();
              navigate("/account/configuration");
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mi cuenta</ListItemText>
          </MenuItem>
          <MenuItem
            sx={{ p: 4 }}
            onClick={() => {
              handleClose();
              navigate("/logout");
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cerrar sesión</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
