import { Box, Grid } from "@mui/material";
import { Formik } from "formik";
import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useHomePageData } from "../../hooks/useHomePageData";
import { updateBusiness } from "../../services/businessService";
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

  const queryClient = useQueryClient();

  const { mutate: updateBusinessMutation } = useMutation({
    mutationFn: updateBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homePageData"] });
    },
  });

  // Fetch home page data
  const { data: homePageData, isLoading, error } = useHomePageData();

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

  const handleSubmit = (values: typeof branchFormInitialValues) => {
    // Aquí enviarías los datos al backend
    console.log("Formulario enviado:", values);
  };

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
      <Box sx={{ flex: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Formik
              initialValues={formInitialValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue }) => {
                // Transform socialMedia object to initialChannels format for ChannelWizardModal
                const initialChannels = Object.entries(values.socialMedia)
                  .filter(
                    ([key, url]) =>
                      url && typeof url === "string" && url.trim() !== "",
                  )
                  .map(([type, url]) => ({ type, url }));

                return (
                  <>
                    <Box sx={{ position: "sticky", top: "4.7rem" }}>
                      <BusinessInfo
                        values={values}
                        homePageData={homePageData}
                        setFieldValue={setFieldValue}
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
                      onEditPhoto={() => {
                        console.log("Abrir modal de cambiar foto");
                      }}
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
