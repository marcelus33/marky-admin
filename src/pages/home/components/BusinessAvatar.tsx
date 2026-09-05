import React from "react";
import { Avatar, SxProps, Theme } from "@mui/material";
import defaultBusinessLogo from "../../../assets/images/marky-m-gray-logo.png";

interface BusinessAvatarProps {
  // Puede ser un File recién seleccionado (aún no subido) o la URL que
  // devuelve el backend.
  photo?: unknown;
  size: number;
  sx?: SxProps<Theme>;
}

// Avatar con el mismo fallback ("marca de agua" de Marky) en todos los
// lugares donde se muestra la foto de perfil del negocio (Home, modal de
// Presentación en desktop y mobile), para que el estado "sin foto" se vea
// igual en todos lados.
const BusinessAvatar: React.FC<BusinessAvatarProps> = ({
  photo,
  size,
  sx,
}) => {
  // El backend siempre completa BusinessProfile.profile_image con un default
  // ("business_profiles/default.png") cuando el negocio no subió una foto,
  // así que un valor no vacío no implica necesariamente que haya una foto
  // real: ese path puntual se trata igual que "sin foto".
  const isBackendDefaultPhoto =
    typeof photo === "string" && photo.includes("business_profiles/default.png");
  const photoSrc =
    photo instanceof File
      ? URL.createObjectURL(photo)
      : !isBackendDefaultPhoto && photo
        ? (photo as string)
        : undefined;
  const hasPhoto = Boolean(photoSrc);

  return (
    <Avatar
      src={photoSrc}
      sx={{
        width: size,
        height: size,
        border: hasPhoto ? "1px solid #D1D5DB" : "1px solid #E0E0E0",
        backgroundColor: hasPhoto ? "#F3F4F6" : "#E5E7EB",
        ...sx,
      }}
    >
      {!hasPhoto && (
        <img
          src={defaultBusinessLogo}
          alt="Marky"
          style={{ width: "45%", height: "45%", objectFit: "contain" }}
        />
      )}
    </Avatar>
  );
};

export default BusinessAvatar;
