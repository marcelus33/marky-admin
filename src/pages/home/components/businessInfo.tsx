import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useRef } from "react";
import { HomePageData } from "../../../services/businessService";
import businessImageDefault from "../../../assets/images/business-image-default.svg";
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
  const theme = useTheme();
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

  // Get profile image - use API data if available, otherwise default
  const profileImageSrc =
    values.profilePhoto instanceof File
      ? URL.createObjectURL(values.profilePhoto)
      : values.profilePhoto || businessImageDefault;
  // Get business name - use API data if available, otherwise placeholder
  const businessName =
    homePageData?.business_name || values.business_name || "nombre_del_negocio";

  // Get categories - use API data if available, otherwise placeholder
  const categoriesText = homePageData?.categories?.length
    ? homePageData.categories.map((cat) => cat.name).join(" | ")
    : values.category || "Panaderia | Cafetería";

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
          <Avatar src={profileImageSrc} sx={{ width: 100, height: 100 }} />
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
