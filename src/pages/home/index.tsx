import { Box, Grid } from "@mui/material";
import { Formik } from "formik";
import { useState, useMemo, useRef, ChangeEvent } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import ImageCropModal from "../../components/ImageCropModal";
import { useHomePageData } from "../../hooks/useHomePageData";
import { useBusinessAccountInfo } from "../../hooks/useBusinessAccountInfo";
import {
  useUpdateBusiness,
  useUpdateBusinessProfileImage,
} from "../../hooks/useBusinessMutations";
import { useImageCropper } from "../../hooks/useImageCropper";
import AttributesModal from "./components/AttributesModal";
import { BusinessInfo } from "./components/businessInfo";
import { ChannelWizardModal } from "./components/ChannelWizardModal";
import DescriptionModal from "./components/DescriptionModal";
import { Header } from "../../components/Header";
import PresentationModal from "./components/PresentationModal";
import { ProductGrid } from "./components/productGrid";
import ProfileActionsRow from "./components/ProfileActionsRow";

export interface Attribute {
  id: number;
  name: string;
}

const branchFormInitialValues = {
  business_name: "",
  category: "",
  // socialMedia: {
  //   instagram: "",
  //   facebook: "",
  //   whatsapp: "",
  // },
  socialMedia: {},
  description: "",
  attributes: [] as Attribute[],
  profilePhoto: "",
};

const Home = () => {
  const [showBackButtonInModals, setShowBackButtonInModals] = useState(false);
  const [openSocialMediaModal, setOpenSocialMediaModal] = useState(false);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [openAttributesModal, setOpenAttributesModal] = useState(false);
  const [openPresentationModal, setOpenPresentationModal] = useState(false);

  const { mutate: updateBusinessMutation } = useUpdateBusiness();

  // Fetch home page data
  const { data: homePageData, isLoading, error } = useHomePageData();
  const { data: businessAccountInfo } = useBusinessAccountInfo();

  // Foto de perfil: se comparte entre el avatar de BusinessInfo y el botón
  // "Cambiar foto" de PresentationModal, así ambos disparan la misma acción.
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfileImage } = useUpdateBusinessProfileImage();
  const setFieldValueRef = useRef<(field: string, value: any) => void>(
    () => {},
  );

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
      setFieldValueRef.current("profilePhoto", croppedImage);
      const formData = new FormData();
      formData.append("profile_image", croppedImage);
      updateProfileImage(formData);
    }
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleOpenCropModal(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleOpenPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  // Transform API data to form format
  const formInitialValues = useMemo(() => {
    if (!homePageData) return branchFormInitialValues;

    // Transform social_links to socialMedia object
    const socialMedia: Record<string, string> = {};
    homePageData.social_links.forEach((link) => {
      socialMedia[link.platform] = link.url;
    });

    // Transform categories to category string
    const categoryNames = homePageData.categories
      .map((cat) => cat.name)
      .join(" | ");

    // Transform headquarter_attributes to attributes array
    const attributes: Attribute[] = homePageData.headquarter_attributes || [];

    return {
      business_name: homePageData.business_name,
      category: categoryNames,
      socialMedia,
      description: homePageData.description || "",
      attributes,
      profilePhoto: homePageData.profile_image,
    };
  }, [homePageData]);

  // Formik aquí solo mantiene el estado local del formulario; cada campo se
  // guarda mediante las mutaciones de los modales hijos (ver más abajo), por
  // lo que este formulario nunca se envía directamente.
  const handleSubmit = () => {};

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingSpinner message="Cargando datos del negocio..." size={50} />
        </Box>
      </Box>
    );
  }

  // Show error state if data fetch failed
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box sx={{ flex: 1, p: 3 }}>
          <Box textAlign="center" py={4}>
            <p>
              Error al cargar los datos del negocio. Por favor, intenta de
              nuevo.
            </p>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box sx={{ flex: 1, p: 3, height: "100%" }}>
        <Grid container spacing={3} sx={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            md={3}
            px={6}
            sx={{
              borderRight: (theme) => ({
                xs: "none",
                md: `1px solid ${theme.palette.grey[600]}`,
              }),
            }}
          >
            <Formik
              initialValues={formInitialValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue }) => {
                setFieldValueRef.current = setFieldValue;

                // Transform socialMedia object to initialChannels format for ChannelWizardModal
                const initialChannels = Object.entries(values.socialMedia)
                  .filter(
                    ([key, url]) =>
                      url && typeof url === "string" && url.trim() !== "",
                  )
                  .map(([type, url]) => ({ type, url }));

                return (
                  <>
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
                    <Box
                      sx={{
                        position: "sticky",
                        top: "4.7rem",
                      }}
                    >
                      <BusinessInfo
                        values={values}
                        homePageData={homePageData}
                        setFieldValue={setFieldValue}
                        onOpenPhotoPicker={handleOpenPhotoPicker}
                        openSocialMediaModal={() =>
                          setOpenSocialMediaModal(true)
                        }
                        openDescriptionModal={() =>
                          setOpenDescriptionModal(true)
                        }
                        openAttributesModal={() => setOpenAttributesModal(true)}
                      />
                      <ProfileActionsRow
                        onEditProfile={() => setOpenPresentationModal(true)}
                        onSettings={() => {
                          console.log("Abrir configuración");
                        }}
                      />
                    </Box>

                    <ChannelWizardModal
                      onBack={
                        showBackButtonInModals
                          ? () => {
                              setOpenPresentationModal(true);
                              setOpenSocialMediaModal(false);
                            }
                          : undefined
                      }
                      open={openSocialMediaModal}
                      onClose={() => setOpenSocialMediaModal(false)}
                      // @ts-ignore
                      initialData={initialChannels}
                      onSubmit={(channels) => {
                        setFieldValue("socialMedia", channels);
                      }}
                    />

                    <DescriptionModal
                      onBack={
                        showBackButtonInModals
                          ? () => {
                              setOpenPresentationModal(true);
                              setOpenDescriptionModal(false);
                            }
                          : undefined
                      }
                      open={openDescriptionModal}
                      onClose={() => setOpenDescriptionModal(false)}
                      initialDescription={values.description}
                      onSubmit={(description) => {
                        updateBusinessMutation({ description });
                        setFieldValue("description", description);
                      }}
                    />

                    <AttributesModal
                      onBack={
                        showBackButtonInModals
                          ? () => {
                              setOpenPresentationModal(true);
                              setOpenAttributesModal(false);
                            }
                          : undefined
                      }
                      open={openAttributesModal}
                      onClose={() => setOpenAttributesModal(false)}
                      initialAttributes={values.attributes}
                      onSubmit={(attributes) => {
                        const attributeIds = attributes.map((attr) => attr.id);
                        updateBusinessMutation({
                          headquarter_attributes: attributeIds,
                        });
                        setFieldValue("attributes", attributes);
                      }}
                    />

                    <PresentationModal
                      open={openPresentationModal}
                      onClose={() => {
                        setOpenPresentationModal(false);
                        setShowBackButtonInModals(false);
                      }}
                      onEditPhoto={handleOpenPhotoPicker}
                      onEditChannels={() => {
                        setOpenSocialMediaModal(true);
                        setOpenPresentationModal(false);
                        setShowBackButtonInModals(true);
                      }}
                      onEditDescription={() => {
                        setOpenDescriptionModal(true);
                        setOpenPresentationModal(false);
                        setShowBackButtonInModals(true);
                      }}
                      onEditAttributes={() => {
                        setOpenAttributesModal(true);
                        setOpenPresentationModal(false);
                        setShowBackButtonInModals(true);
                      }}
                      values={values}
                      profilePhoto={values.profilePhoto}
                      businessId={businessAccountInfo?.business_id}
                    />
                  </>
                );
              }}
            </Formik>
          </Grid>
          <Grid item xs={12} md={9}>
            <ProductGrid />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default Home;
