import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Header } from "../../components/Header";

// Small reusable card for the settings sections
const SettingsCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  onEdit?: () => void;
  children?: React.ReactNode;
}> = ({ title, icon, onEdit, children }) => {
  return (
    <Paper sx={{ borderRadius: 2, p: 3, mb: 3 }} elevation={0}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
        {onEdit && (
          <IconButton size="small" onClick={onEdit}>
            <EditOutlinedIcon />
          </IconButton>
        )}
      </Box>
      <Box mt={2}>{children}</Box>
    </Paper>
  );
};

const AccountConfigurationPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedSection, setSelectedSection] = useState<
    "configuration" | "security"
  >("configuration");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };
  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <Box>
      <Header />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        {!isMobile && (
          <Box sx={{ width: 280, p: 4, borderRight: "1px solid #F0F0F0" }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
            >
              <Avatar sx={{ width: 90, height: 90, mb: 2 }} />
              <Typography variant="h6">Nombre del Comercio</Typography>
              <Typography variant="caption" color="text.secondary">
                Usuario
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tu cuenta
            </Typography>
            <List>
              <ListItemButton
                selected={selectedSection === "configuration"}
                onClick={() => setSelectedSection("configuration")}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Configuración" />
              </ListItemButton>
              <ListItemButton
                selected={selectedSection === "security"}
                onClick={() => setSelectedSection("security")}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <LockOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Seguridad" />
              </ListItemButton>
              <ListItemButton disabled sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemIcon>
                  <CategoryOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Suscripción" />
              </ListItemButton>
              <ListItemButton disabled sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemIcon>
                  <BadgeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Facturación" />
              </ListItemButton>
            </List>
          </Box>
        )}

        {/* Content area */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 6 } }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Box>
              <Typography variant="h4">
                {selectedSection === "configuration"
                  ? "Configuración"
                  : "Seguridad"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @nombre_empresa_gastronómica
              </Typography>
            </Box>
            <Box>
              {/* date pill */}
              <Button variant="outlined" size="small">
                Creada el 17/07/2025
              </Button>
            </Box>
          </Box>

          {isMobile && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">
                {selectedSection === "configuration"
                  ? "Configuración"
                  : "Seguridad"}
              </Typography>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    setSelectedSection("configuration");
                    handleMenuClose();
                  }}
                >
                  Configuración
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSelectedSection("security");
                    handleMenuClose();
                  }}
                >
                  Seguridad
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Sections */}
          {selectedSection === "configuration" ? (
            <Box>
              <Box display={{ xs: "block", md: "flex" }} gap={3} mb={3}>
                <Box flex={1}>
                  <SettingsCard
                    title="ID del comercio"
                    icon={<BadgeOutlinedIcon />}
                    onEdit={() => {}}
                  >
                    <Box
                      display="flex"
                      gap={2}
                      flexDirection={{ xs: "column", md: "row" }}
                    >
                      <Box flex={1}>
                        <Typography variant="caption">Nombre</Typography>
                        <Box
                          mt={1}
                          p={1}
                          sx={{ backgroundColor: "#F7F7F8", borderRadius: 1 }}
                        >
                          Café de Acá
                        </Box>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="caption">Usuario</Typography>
                        <Box
                          mt={1}
                          p={1}
                          sx={{ backgroundColor: "#F7F7F8", borderRadius: 1 }}
                        >
                          cafedeaca
                        </Box>
                      </Box>
                    </Box>
                    <Box mt={2} display="flex" gap={2} alignItems="center">
                      <Box
                        flex={1}
                        sx={{
                          backgroundColor: "#F7F7F8",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        marky.me/cafedeaca
                      </Box>
                      <Button variant="outlined">Copiar enlace</Button>
                    </Box>
                  </SettingsCard>
                </Box>

                <Box sx={{ width: 320 }}>
                  {/* placeholder for QR block omitted as requested */}
                  <Paper
                    sx={{ borderRadius: 2, p: 3, backgroundColor: "#F0F8FF" }}
                    elevation={0}
                  >
                    <Typography variant="subtitle1" align="center">
                      QR de tu comercio
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                      Comparte tu propuesta gastronómica. Tus clientes podrán
                      escanearlo desde su celular y acceder a tu perfil
                      fácilmente.
                    </Typography>
                    <Button fullWidth variant="contained">
                      Descargar QR
                    </Button>
                  </Paper>
                </Box>
              </Box>

              <SettingsCard
                title="Categoría comercial"
                icon={<CategoryOutlinedIcon />}
                onEdit={() => {}}
              >
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Ayudará a las personas a encontrar comercios como el tuyo.
                  Puedes cambiar esta opción cuando quieras.
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip label="Panadería" color="primary" />
                  <Chip label="Pastelería" color="primary" />
                </Box>
              </SettingsCard>

              <SettingsCard
                title="Ubicación geográfica"
                icon={<LocationOnOutlinedIcon />}
                onEdit={() => {}}
              >
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  <Box flex={1}>
                    <Typography variant="caption">País</Typography>
                    <Box
                      mt={1}
                      p={1}
                      sx={{
                        backgroundColor: "#F7F7F8",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <img
                        src={require("../../assets/icons/flag-paraguay.svg")}
                        alt="py"
                        style={{ width: 24 }}
                      />
                      <span>Paraguay</span>
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="caption">Ciudad</Typography>
                    <Box
                      mt={1}
                      p={1}
                      sx={{ backgroundColor: "#F7F7F8", borderRadius: 1 }}
                    >
                      Asunción
                    </Box>
                  </Box>
                </Box>
              </SettingsCard>

              <SettingsCard
                title="Tipo de negocio"
                icon={<StorefrontOutlinedIcon />}
                onEdit={() => {}}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip label="Comercial" color="primary" />
                  <Typography variant="body2">
                    Tu negocio dispone de sucursal para recibir clientes o
                    comensales
                  </Typography>
                </Box>
              </SettingsCard>

              <SettingsCard
                title="Expresión monetaria"
                icon={<AttachMoneyOutlinedIcon />}
                onEdit={() => {}}
              >
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  <Box flex={1}>
                    <Typography variant="caption">Moneda de uso</Typography>
                    <Box
                      mt={1}
                      p={1}
                      sx={{ backgroundColor: "#F7F7F8", borderRadius: 1 }}
                    >
                      Gs. - Guaraní
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="caption">Moneda Secundaria</Typography>
                    <Box
                      mt={1}
                      p={1}
                      sx={{ backgroundColor: "#F7F7F8", borderRadius: 1 }}
                    >
                      USD $ - Dólar Americano
                    </Box>
                  </Box>
                </Box>
                <Box mt={2}>
                  <Typography variant="body2">
                    Precios con tasa de cambio
                  </Typography>
                  <Typography variant="caption">
                    Se mostrará el valor de cambio en tus productos.
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={2}>
                    <Box
                      sx={{
                        backgroundColor: "#FFF4E8",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                      }}
                    >
                      1 Gs.
                    </Box>
                    <Box>es igual a:</Box>
                    <Box
                      sx={{
                        backgroundColor: "#F7F7F8",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                      }}
                    >
                      0.00013 USD $
                    </Box>
                    <IconButton>
                      <CachedIcon />
                    </IconButton>
                  </Box>
                </Box>
              </SettingsCard>
            </Box>
          ) : (
            <Box>
              <SettingsCard
                title="Datos de acceso"
                icon={<MailOutlineIcon />}
                onEdit={() => {}}
              >
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  <Box flex={1}>
                    <Typography variant="caption">Email</Typography>
                    <Box
                      mt={1}
                      p={1}
                      sx={{ backgroundColor: "#F7F7F8", borderRadius: 1 }}
                    >
                      nombre@correo.com
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="caption">Teléfono</Typography>
                    <Box
                      mt={1}
                      p={1}
                      sx={{ backgroundColor: "#F7F7F8", borderRadius: 1 }}
                    >
                      +584143125454
                    </Box>
                  </Box>
                </Box>
              </SettingsCard>

              <SettingsCard
                title="Contraseña"
                icon={<VpnKeyOutlinedIcon />}
                onEdit={() => {}}
              >
                <Typography variant="body2">
                  Cambia tu contraseña en cualquier momento.
                </Typography>
                <Box mt={2}>
                  <Button variant="text" color="primary">
                    Cambiar contraseña
                  </Button>
                </Box>
              </SettingsCard>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountConfigurationPage;
