import { Box, Typography } from "@mui/material";
import React from "react";
import { HomePageData } from "../../../services/businessService";
import AttributesInfo from "./AttributesInfo";
import BusinessAvatar from "./BusinessAvatar";
import DescriptionInfo from "./DescriptionInfo";
import SocialMediaInfo from "./SocialMediaInfo";
import { PhotoCamera } from "@mui/icons-material";

export const BusinessInfo: React.FC<{
  values: any;
  homePageData?: HomePageData;
  setFieldValue: (field: string, value: any) => void;
  openSocialMediaModal: () => void;
  openDescriptionModal: () => void;
  openAttributesModal: () => void;
  onOpenPhotoPicker: () => void;
}> = ({
  values,
  homePageData,
  openSocialMediaModal,
  openDescriptionModal,
  openAttributesModal,
  onOpenPhotoPicker,
}) => {
  // Get business name - use API data if available, otherwise placeholder
  const businessName =
    homePageData?.business_name || values.business_name || "nombre_del_negocio";

  // Get categories - use API data if available, otherwise placeholder
  const categoriesText = homePageData?.categories?.length
    ? homePageData.categories.map((cat) => cat.name).join(" | ")
    : values.category || "Panaderia | Cafetería";

  const hasAnySocialMedia = Object.values(values.socialMedia || {}).some(
    (entries: any) =>
      Array.isArray(entries) &&
      entries.some((entry: any) => entry.url && entry.url.trim() !== ""),
  );
  const isProfileIncomplete =
    !hasAnySocialMedia ||
    !values.description ||
    (values.attributes || []).length === 0;

  return (
    <Box p={2}>
      {/* Datos principales del negocio (avatar, nombre, etc.) */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Box
          onClick={onOpenPhotoPicker}
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
          <BusinessAvatar photo={values.profilePhoto} size={100} />
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
