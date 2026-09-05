import { Avatar, Box, Typography } from "@mui/material";
import React, { useRef } from "react";
import { HomePageData } from "../../../services/businessService";
import defaultBusinessLogo from "../../../assets/images/marky-m-gray-logo.png";
import AttributesInfo from "./AttributesInfo";
import DescriptionInfo from "./DescriptionInfo";
import SocialMediaInfo from "./SocialMediaInfo";
import { useImageCropper } from "../../../hooks/useImageCropper";
import { useUpdateBusinessProfileImage } from "../../../hooks/useBusinessMutations";
import ImageCropModal from "../../../components/ImageCropModal";
import { PhotoCamera } from "@mui/icons-material";

export const BusinessInfo: React.FC<{
  values: any;
  homePageData?: HomePageData;
  setFieldValue: (field: string, value: any) => void;
  openSocialMediaModal: () => void;
  openDescriptionModal: () => void;
  openAttributesModal: () => void;
}> = ({
  values,
  homePageData,
  setFieldValue,
  openSocialMediaModal,
  openDescriptionModal,
  openAttributesModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfileImage } = useUpdateBusinessProfileImage();

  const {
    crop,
    zoom,
    croppingMedia,
    imageUrl,
    setCrop,
    setZoom,
    handleCropComplete,
    handleOpenCropModal,
    handleCloseCropModal,
    handleApplyCrop,
    handleZoomChange,
  } = useImageCropper((croppedImage) => {
    if (croppedImage) {
      setFieldValue("profilePhoto", croppedImage);
      const formData = new FormData();
      formData.append("profile_image", croppedImage);
      updateProfileImage(formData);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleOpenCropModal(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  // Get profile image - use API data if available, otherwise show the
  // default Marky mark centered in a neutral circle (see hasProfilePhoto
  // below). The backend always fills BusinessProfile.profile_image with a
  // model-level default ("business_profiles/default.png") when the business
  // hasn't uploaded a photo, so a non-empty API value doesn't by itself mean
  // the business has a real photo - treat that specific placeholder path the
  // same as "no photo".
  const isBackendDefaultPhoto =
    typeof values.profilePhoto === "string" &&
    values.profilePhoto.includes("business_profiles/default.png");
  const profileImageSrc =
    values.profilePhoto instanceof File
      ? URL.createObjectURL(values.profilePhoto)
      : !isBackendDefaultPhoto && values.profilePhoto
        ? values.profilePhoto
        : undefined;
  const hasProfilePhoto = Boolean(profileImageSrc);
  // Get business name - use API data if available, otherwise placeholder
  const businessName =
    homePageData?.business_name || values.business_name || "nombre_del_negocio";

  // Get categories - use API data if available, otherwise placeholder
  const categoriesText = homePageData?.categories?.length
    ? homePageData.categories.map((cat) => cat.name).join(" | ")
    : values.category || "Panaderia | Cafetería";

  const hasAnySocialMedia = Object.values(values.socialMedia || {}).some(
    (url) => typeof url === "string" && url.trim() !== "",
  );
  const isProfileIncomplete =
    !hasAnySocialMedia ||
    !values.description ||
    (values.attributes || []).length === 0;

  return (
    <Box p={2}>
      <ImageCropModal
        open={!!croppingMedia}
        onClose={handleCloseCropModal}
        onApply={handleApplyCrop}
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        handleZoomChange={handleZoomChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />
      {/* Datos principales del negocio (avatar, nombre, etc.) */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Box
          onClick={handleIconClick}
          sx={{
            position: "relative",
            cursor: "pointer",
            width: 100,
            height: 100,
            "&:hover .edit-icon": {
              display: "flex",
            },
          }}
        >
          <Avatar
            src={profileImageSrc}
            sx={{
              width: 100,
              height: 100,
              border: hasProfilePhoto ? "1px solid #D1D5DB" : "1px solid #E0E0E0",
              backgroundColor: hasProfilePhoto ? "#F3F4F6" : "#E5E7EB",
            }}
          >
            {!hasProfilePhoto && (
              <img
                src={defaultBusinessLogo}
                alt="Marky"
                style={{ width: "45%", height: "45%", objectFit: "contain" }}
              />
            )}
          </Avatar>
          <Box
            className="edit-icon"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              color: "white",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
          >
            <PhotoCamera />
          </Box>
        </Box>
        <Typography
          variant="h3"
          mt={1}
          sx={{ fontSize: "18px", fontWeight: 500 }}
        >
          {businessName}
        </Typography>
        <Typography variant="body2" mt={1}>
          {categoriesText}
        </Typography>
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={1} mt={4}>
        {isProfileIncomplete && (
          <Typography
            sx={{
              color: "#374151",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: "18px",
              textAlign: "center",
              mb: 1,
            }}
          >
            Completa el perfil de tu negocio
          </Typography>
        )}
        {/* Redes sociales */}
        <SocialMediaInfo
          socialMedia={values.socialMedia}
          onOpen={openSocialMediaModal}
        />
        {/* Descripción */}
        <Box mt={2}>
          <DescriptionInfo
            description={values.description}
            onOpen={openDescriptionModal}
          />
        </Box>
        {/* Atributos */}
        <Box mt={2}>
          <AttributesInfo
            attributes={values.attributes}
            onOpen={openAttributesModal}
          />
        </Box>
      </Box>
    </Box>
  );
};
