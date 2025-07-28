import { Avatar, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { HomePageData } from "../../../services/businessService";
import businessImageDefault from "../../../assets/images/business-image-default.svg";
import AttributesInfo from "./AttributesInfo";
import DescriptionInfo from "./DescriptionInfo";
import SocialMediaInfo from "./SocialMediaInfo";

export const BusinessInfo: React.FC<{
  values: any;
  homePageData?: HomePageData;
  openSocialMediaModal: () => void;
  openDescriptionModal: () => void;
  openAttributesModal: () => void;
}> = ({
  values,
  homePageData,
  openSocialMediaModal,
  openDescriptionModal,
  openAttributesModal,
}) => {
  const theme = useTheme();

  // Get profile image - use API data if available, otherwise default
  const profileImageSrc = homePageData?.profile_image || businessImageDefault;

  // Get business name - use API data if available, otherwise placeholder
  const businessName =
    homePageData?.business_name || values.business_name || "nombre_del_negocio";

  // Get categories - use API data if available, otherwise placeholder
  const categoriesText = homePageData?.categories?.length
    ? homePageData.categories.map((cat) => cat.name).join(" | ")
    : values.category || "Panaderia | Cafetería";

  return (
    <Box p={2}>
      {/* Datos principales del negocio (avatar, nombre, etc.) */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar src={profileImageSrc} sx={{ width: 100, height: 100 }} />
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
