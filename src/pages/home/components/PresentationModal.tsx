import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  ButtonBase,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EditIcon from "@mui/icons-material/Edit";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ReactComponent as FacebookIcon } from "../../../assets/icons/facebook.svg";
import XButton from "../../../components/XButton";
import BusinessAvatar from "./BusinessAvatar";
import colors from "../../../themes/utils/colors";
import { ShowNotification } from "../../../utils/utils";
import { Attribute } from "..";

interface PresentationModalProps {
  open: boolean;
  onClose: () => void;
  onEditPhoto: () => void;
  onEditChannels: () => void;
  onEditDescription: () => void;
  onEditAttributes: () => void;
  profilePhoto?: string;
  businessId?: string;
  values: any;
}

const attributesPlaceholder: Attribute[] = [
  {
    id: 1,
    name: "Wifi",
  },
  {
    id: 2,
    name: "Estacionamiento",
  },
  {
    id: 3,
    name: "+1",
  },
];

interface MobileRowProps {
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  last?: boolean;
}

const MobileRow: React.FC<MobileRowProps> = ({
  label,
  value,
  placeholder,
  onClick,
  last,
}) => {
  const rowSx = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 2,
    px: 4,
    py: 3,
    borderBottom: last ? "none" : `1px solid ${colors.light.grey[400]}`,
  };
  const content = (
    <>
      <Box flex={1} minWidth={0} textAlign="left">
        <Typography
          variant="body2"
          sx={{ color: colors.light.text.secondary, mb: 1 }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: value ? colors.light.text.primary : colors.light.grey[900],
            fontWeight: value ? 700 : 400,
            wordBreak: "break-word",
          }}
        >
          {value || placeholder}
        </Typography>
      </Box>
      {onClick && (
        <ChevronRightIcon sx={{ color: colors.light.text.disabled }} />
      )}
    </>
  );

  return onClick ? (
    <ButtonBase onClick={onClick} sx={rowSx}>
      {content}
    </ButtonBase>
  ) : (
    <Box sx={rowSx}>{content}</Box>
  );
};

const PresentationModal: React.FC<PresentationModalProps> = ({
  open,
  onClose,
  onEditPhoto,
  onEditChannels,
  onEditDescription,
  onEditAttributes,
  //   profilePhoto,
  businessId,
  values,
}) => {
  const { socialMedia, description, attributes, profilePhoto } = values;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const hasChannels =
    socialMedia &&
    (Object.values(socialMedia) as string[]).some(
      (url: string) => url.trim() !== "",
    );
  const hasDescription = description && description.trim() !== "";
  const hasAttributes = attributes && attributes.length > 0;

  const handleCopyLink = async () => {
    if (!businessId) return;
    try {
      await navigator.clipboard.writeText(`marky.one/${businessId}`);
      ShowNotification({ message: "Enlace copiado", type: "success" });
    } catch {
      ShowNotification({ message: "No se pudo copiar el enlace", type: "error" });
    }
  };

  if (isMobile) {
    return (
      <Dialog open={open} onClose={onClose} fullScreen>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            borderBottom: `1px solid ${colors.light.grey[400]}`,
          }}
        >
          <DialogTitle sx={{ flex: 1 }}>Editar perfil</DialogTitle>
          <Box display={"flex"} sx={{ paddingY: 3 }}>
            <XButton
              onClick={onClose}
              sx={{
                marginRight: 3,
                backgroundColor: colors.light.grey[400],
                borderRadius: "6px",
                "&:hover": { backgroundColor: colors.light.grey[400] },
              }}
            />
          </Box>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            sx={{
              px: 4,
              py: 3,
              borderBottom: `1px solid ${colors.light.grey[400]}`,
            }}
          >
            <BusinessAvatar photo={profilePhoto} size={92} />
            <Button
              variant="outlined"
              onClick={onEditPhoto}
              sx={{
                borderColor: colors.light.grey[800],
                color: colors.light.text.primary,
                px: 3,
                boxShadow: 0,
                textTransform: "none",
              }}
            >
              Cambiar foto
            </Button>
          </Box>

          <MobileRow label="Nombre" value={values.business_name} />
          <MobileRow label="Usuario" value={businessId} />
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{
              width: "100%",
              px: 4,
              py: 3,
              borderBottom: `1px solid ${colors.light.grey[400]}`,
            }}
          >
            <Box flex={1} minWidth={0}>
              <Typography
                variant="body2"
                sx={{ color: colors.light.text.primary, mb: 1 }}
              >
                Tu enlace público
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  wordBreak: "break-word",
                }}
              >
                marky.one/{businessId || "..."}
              </Typography>
            </Box>
            <IconButton onClick={handleCopyLink} size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>

          <MobileRow
            label="Canales"
            value={
              hasChannels
                ? (Object.entries(socialMedia) as [string, string][])
                    .filter(([, url]) => url && url.trim() !== "")
                    .map(([platform]) => platform)
                    .join(", ")
                : undefined
            }
            placeholder="Agrega tus canales de marca"
            onClick={onEditChannels}
          />
          <MobileRow
            label="Descripción"
            value={hasDescription ? description : undefined}
            placeholder="Escribe una breve descripción sobre tu negocio y cuál es tu producto estrella de tu propuesta."
            onClick={onEditDescription}
          />
          <MobileRow
            label="Atributos"
            value={
              hasAttributes
                ? attributes.map((attr: any) => attr.name).join(", ")
                : undefined
            }
            placeholder="Identifica lo que te distingue"
            onClick={onEditAttributes}
            last
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
      >
        <DialogTitle sx={{ flex: 1 }}>Presentación</DialogTitle>
        <Box display={"flex"} sx={{ paddingY: 3 }}>
          <XButton onClick={onClose} sx={{ marginRight: 2 }} />
        </Box>
      </Box>
      <DialogContent sx={{ p: 0, maxHeight: "80vh", mb: 3 }}>
        {/* Foto de perfil */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
          my={4}
          px={8}
        >
          <Box display={"flex"} alignItems={"center"} gap={3}>
            <BusinessAvatar photo={profilePhoto} size={80} />
            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <Typography
                variant="h3"
                mt={1}
                sx={{ fontSize: "14px", fontWeight: 700 }}
              >
                {values.business_name}
              </Typography>
              {businessId && (
                <Typography variant="body2" sx={{ color: "grey.500" }}>
                  @{businessId}
                </Typography>
              )}
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onEditPhoto}
            sx={{ ml: 2, px: 3, boxShadow: 0 }}
          >
            Cambiar foto
          </Button>
        </Box>
        {/* Canales */}
        <Box
          onClick={onEditChannels}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            cursor: "pointer",
            mb: 4,
            mx: hasChannels ? 0 : 8,
            p: 2,
            px: 8,
            pb: 4,
            backgroundColor: "inherit",
            "&:hover": {
              backgroundColor: "grey.100",
            },
            border: hasChannels ? "" : "1px dashed",
            borderColor: "primary.main",
            borderRadius: 1,
            position: "relative",
            "&:hover .edit-icon": {
              opacity: 1,
            },
          }}
        >
          {/* <Typography variant="subtitle2" color="textSecondary">
            Canales
          </Typography> */}
          {hasChannels ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"center"}
              gap={1}
              mt={1}
            >
              {socialMedia.instagram && socialMedia.instagram.trim() !== "" && (
                <Box
                  sx={{
                    border: "1px solid lightgrey",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <InstagramIcon />
                </Box>
              )}
              {socialMedia.facebook && socialMedia.facebook.trim() !== "" && (
                <Box
                  sx={{
                    border: "1px solid lightgrey",
                    borderRadius: 1,
                    p: 1.8,
                  }}
                >
                  <FacebookIcon />
                </Box>
              )}
              {socialMedia.whatsapp && socialMedia.whatsapp.trim() !== "" && (
                <Box
                  sx={{
                    border: "1px solid lightgrey",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <WhatsAppIcon />
                </Box>
              )}
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"center"}
              flexDirection={"column"}
              gap={2}
              mt={1}
            >
              <Box
                sx={{
                  // border: "2px solid red",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <IconButton
                  aria-label="Instagram"
                  sx={{
                    backgroundColor: "grey.200",
                    borderRadius: 1,
                    p: 2, // Padding opcional
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  aria-label="Facebook"
                  sx={{
                    backgroundColor: "grey.200",
                    borderRadius: 1,
                    p: 2, // Padding opcional
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  aria-label="WhatsApp"
                  sx={{
                    backgroundColor: "grey.200",
                    borderRadius: 1,
                    p: 2, // Padding opcional
                  }}
                >
                  <WhatsAppIcon />
                </IconButton>
              </Box>
              <Typography
                variant="body2"
                color="primary"
                mt={1}
                fontWeight={700}
              >
                Añade tus canales
              </Typography>
            </Box>
          )}
          <Box
            className="edit-icon"
            sx={{
              position: "absolute",
              top: "45%",
              right: 20,
              opacity: 0,
              transition: "opacity 0.3s",
            }}
          >
            <EditIcon fontSize="medium" />
          </Box>
        </Box>
        {/* Descripción */}
        <Box
          onClick={onEditDescription}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            mb: 4,
            mx: hasDescription ? 0 : 8,
            p: 2,
            px: 8,
            border: hasDescription ? "" : "1px dashed",
            borderColor: "primary.main",
            borderRadius: 1,
            backgroundColor: "inherit",
            position: "relative",
            "&:hover": {
              backgroundColor: "grey.100",
            },
            "&:hover .edit-icon": {
              opacity: 1,
            },
          }}
        >
          {hasDescription ? (
            <Typography
              variant="subtitle1"
              mt={1}
              mr={8}
              sx={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
              }}
            >
              {description}
            </Typography>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"center"}
              gap={1}
              my={1}
            >
              <Typography
                variant="body2"
                color="primary"
                mt={1}
                fontWeight={700}
              >
                Añadir descripción
              </Typography>
            </Box>
          )}
          <Box
            className="edit-icon"
            sx={{
              position: "absolute",
              top: "27%",
              // alignSelf: "end",
              right: 20,
              opacity: 0,
              transition: "opacity 0.3s",
            }}
          >
            <EditIcon fontSize="medium" />
          </Box>
        </Box>
        {/* Atributos */}
        <Box
          onClick={onEditAttributes}
          sx={{
            cursor: "pointer",
            mb: 4,
            // p: 2,
            mx: hasAttributes ? 0 : 8,
            px: 8,
            pb: 2,
            border: hasAttributes ? "" : "1px dashed",
            borderColor: "primary.main",
            borderRadius: 1,
            backgroundColor: "inherit",
            position: "relative",
            "&:hover": {
              backgroundColor: "grey.100",
            },
            "&:hover .edit-icon": {
              opacity: 1,
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {hasAttributes ? (
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {attributes.map((attr: any) => (
                <Box
                  key={attr.id}
                  sx={{
                    backgroundColor: "#E8F3FF",
                    padding: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="primary">
                    {attr.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"center"}
              flexDirection={"column"}
              gap={2}
              my={1}
            >
              <Typography
                variant="body2"
                color="primary"
                mt={2}
                fontWeight={700}
              >
                Define tus atributos
              </Typography>
              {/*  */}
              <Box display="flex" flexWrap="wrap" gap={1}>
                {attributes.length < 1 &&
                  attributesPlaceholder.map((attr: any) => (
                    <Box
                      key={attr.id}
                      sx={{
                        backgroundColor: "grey.200",
                        padding: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="textDisabled">
                        {attr.name}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          )}
          <Box
            className="edit-icon"
            sx={{
              position: "absolute",
              top: "40%",
              right: 20,
              opacity: 0,
              transition: "opacity 0.3s",
            }}
          >
            <EditIcon fontSize="medium" />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PresentationModal;
