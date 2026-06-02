import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EditIcon from "@mui/icons-material/Edit";
import { ReactComponent as FacebookIcon } from "../../../assets/icons/facebook.svg";
import XButton from "../../../components/XButton";
import { Attribute } from "..";

interface PresentationModalProps {
  open: boolean;
  onClose: () => void;
  onEditPhoto: () => void;
  onEditChannels: () => void;
  onEditDescription: () => void;
  onEditAttributes: () => void;
  profilePhoto?: string;
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

const PresentationModal: React.FC<PresentationModalProps> = ({
  open,
  onClose,
  onEditPhoto,
  onEditChannels,
  onEditDescription,
  onEditAttributes,
  //   profilePhoto,
  values,
}) => {
  const { socialMedia, description, attributes, profilePhoto } = values;
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
            <Avatar
              src={profilePhoto || ""}
              sx={{ width: 80, height: 80, bgcolor: "grey.300" }}
            />
            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <Typography
                variant="h3"
                mt={1}
                sx={{ fontSize: "14px", fontWeight: 700 }}
              >
                Nombre comercial
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.500" }}>
                @nombre-usuario
              </Typography>
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
            mx:
              socialMedia &&
              (Object.values(socialMedia) as string[]).some(
                (url: string) => url.trim() !== ""
              )
                ? 0
                : 8,
            p: 2,
            px: 8,
            pb: 4,
            backgroundColor: "inherit",
            "&:hover": {
              backgroundColor: "grey.100",
            },
            border:
              socialMedia &&
              (Object.values(socialMedia) as string[]).some(
                (url: string) => url.trim() !== ""
              )
                ? ""
                : "1px dashed",
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
          {socialMedia &&
          (Object.values(socialMedia) as string[]).some(
            (url: string) => url.trim() !== ""
          ) ? (
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
            mx: description && description.trim() !== "" ? 0 : 8,
            p: 2,
            px: 8,
            border:
              description && description.trim() !== "" ? "" : "1px dashed",
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
          {description && description.trim() !== "" ? (
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
            mx: attributes && attributes.length > 0 ? 0 : 8,
            px: 8,
            pb: 2,
            border: attributes && attributes.length > 0 ? "" : "1px dashed",
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
          {attributes && attributes.length > 0 ? (
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {attributes.map((attr: any, i: number) => (
                <Box
                  key={i}
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
                  attributesPlaceholder.map((attr: any, i: number) => (
                    <Box
                      key={i}
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
