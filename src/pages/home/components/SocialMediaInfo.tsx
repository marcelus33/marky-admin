import React from "react";
import { Box, Typography } from "@mui/material";
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

  return (
    <Box
      onClick={onOpen}
      sx={{
        border: isEmpty ? "1px dashed #B8CDF5" : "none",
        backgroundColor: isEmpty ? "#FAFCFF" : "transparent",
        borderRadius: isEmpty ? "6px" : 2,
        py: isEmpty ? 4 : 2,
        px: isEmpty ? 3 : 2,
        cursor: "pointer",
      }}
    >
      {isEmpty ? (
        <Typography
          sx={{
            color: "#2563EB",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "22px",
            textAlign: "center",
          }}
        >
          Agrega tus canales
        </Typography>
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
