import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Field, FieldArray, FormikProps, getIn } from "formik";
import NumberInput from "../../../components/NumberInput";
import { useImageCropper } from "../../../hooks/useImageCropper";
import ImageCropModal from "../../../components/ImageCropModal";
import Input from "../../../components/Input";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ReactComponent as AddVariationImageIcon } from "../../../assets/icons/product-form/add-variation-picture.svg";

interface VariationsSectionProps extends FormikProps<any> {
  maxItems?: number;
}

const VariationsSection: React.FC<VariationsSectionProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
  handleChange,
  handleBlur,
  maxItems = 10,
}) => {
  const [multiPresentation, setMultiPresentation] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(
    null
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
    if (activeVariantIndex !== null) {
      setFieldValue(`variants[${activeVariantIndex}].image`, croppedImage);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleOpenCropModal(file);
    }
    // Reset file input to allow selecting the same file again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleIconClick = (index: number) => {
    setActiveVariantIndex(index);
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "grey.100",
        borderRadius: 2,
        p: 4,
      }}
    >
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
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <LocalOfferIcon />
        <Typography variant="h6" fontWeight="bold">
          Variaciones del producto base
        </Typography>
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={multiPresentation}
            onChange={(e) => setMultiPresentation(e.target.checked)}
          />
        }
        label="Activar multi presentaciones"
      />
      {multiPresentation && (
        <FieldArray name="variants">
          {({ push, remove }) => (
            <Box mt={2}>
              {values.variants.map((variant: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid",
                    borderColor: "grey.100",
                    borderRadius: 1,
                    p: 3,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    backgroundColor: "grey.50",
                  }}
                >
                  {/* IMAGE */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        border: "2px dashed",
                        borderColor: "primary.main",
                        borderRadius: 1,
                        width: 80,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      onClick={() => handleIconClick(index)}
                    >
                      {variant.image ? (
                        <img
                          src={
                            typeof variant.image === "string"
                              ? variant.image
                              : URL.createObjectURL(variant.image)
                          }
                          alt="Variant"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <IconButton>
                          <AddVariationImageIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  {/* INPUTS  */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      gap: 2,
                    }}
                  >
                    <Input
                      name={`variants[${index}].name`}
                      label="Nombre de presentación"
                      placeholder="Nombre de presentación"
                      value={variant.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      error={
                        getIn(touched, `variants[${index}].name`) &&
                        Boolean(getIn(errors, `variants[${index}].name`))
                      }
                      helperText={
                        getIn(touched, `variants[${index}].name`)
                          ? getIn(errors, `variants[${index}].name`)
                          : undefined
                      }
                      InputProps={{
                        sx: {
                          backgroundColor: "white",
                        },
                      }}
                    />

                    <Input
                      name={`variants[${index}].description`}
                      label="Descripción"
                      placeholder="Descripción"
                      value={variant.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{
                        sx: {
                          backgroundColor: "white",
                        },
                      }}
                    />

                    <Field
                      name={`variants[${index}].price`}
                      component={NumberInput}
                      label="Precio"
                      required
                      fullWidth
                      margin="normal"
                      InputProps={{
                        sx: {
                          backgroundColor: "white",
                        },
                      }}
                    />
                  </Box>
                  {/* DELETE BUTTON */}
                  <Box
                    sx={{
                      backgroundColor: "grey.400",
                      justifyItems: "center",
                      borderRadius: 2,
                      mt: 5,
                      p: 1,
                    }}
                  >
                    <IconButton onClick={() => remove(index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: "#DBE9F9",
                    borderRadius: 2,
                    mr: 2,
                  }}
                >
                  <Add fontSize="large" color="primary" sx={{ mt: 1 }} />
                </Box>
                <Button
                  onClick={() =>
                    push({
                      id: Date.now(),
                      name: "",
                      description: "",
                      price: "",
                      image: null,
                    })
                  }
                  disabled={values.variants.length >= maxItems}
                >
                  Añadir otra presentación
                </Button>
              </Box>
            </Box>
          )}
        </FieldArray>
      )}
    </Box>
  );
};

export default VariationsSection;
