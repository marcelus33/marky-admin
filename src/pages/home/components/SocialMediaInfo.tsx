import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { ReactComponent as FacebookIcon } from "../../../assets/icons/facebook.svg";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageIcon from "@mui/icons-material/Language";

interface SocialMediaInfoProps {
  socialMedia: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    website?: string;
  };
  onOpen: () => void;
}

const SocialMediaInfo: React.FC<SocialMediaInfoProps> = ({
  socialMedia,
  onOpen,
}) => {
  const hasInstagram =
    socialMedia.instagram && socialMedia.instagram.trim() !== "";
  const hasFacebook =
    socialMedia.facebook && socialMedia.facebook.trim() !== "";
  const hasWhatsApp =
    socialMedia.whatsapp && socialMedia.whatsapp.trim() !== "";
  const hasWebsite = socialMedia.website && socialMedia.website.trim() !== "";

  const isEmpty = !hasInstagram && !hasFacebook && !hasWhatsApp;

  console.log("isEmpty ====>", isEmpty, socialMedia);

  return (
    <Box
      onClick={onOpen}
      sx={{
        border: isEmpty ? "2px dashed" : "none",
        borderColor: "primary.main",
        padding: 2,
        borderRadius: 2,
        cursor: "pointer",
      }}
    >
      {isEmpty ? (
        <Box
          display="flex"
          alignItems="center"
          flexDirection={"column"}
          gap={3}
          p={2}
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
          <Typography color="primary" fontWeight={500}>
            Añadir canales
          </Typography>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          sx={{ border: "0px solid red", justifyContent: "center" }}
        >
          {hasInstagram && (
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
          {hasFacebook && (
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
          {hasWhatsApp && (
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
          {hasWebsite && (
            <Box
              sx={{
                border: "1px solid lightgrey",
                borderRadius: 1,
                p: 2,
              }}
            >
              <LanguageIcon />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SocialMediaInfo;
