import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { Add, Delete, PhotoCamera } from "@mui/icons-material";
import { Field, FieldArray, FormikProps, getIn } from "formik";
import NumberInput from "../../../components/NumberInput";
import { useImageCropper } from "../../../hooks/useImageCropper";
import ImageCropModal from "../../../components/ImageCropModal";

interface VariationsSectionProps extends FormikProps<any> {
  maxItems?: number;
}

const VariationsSection: React.FC<VariationsSectionProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
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
    <Box>
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
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Variaciones del producto base
      </Typography>
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
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        sx={{
                          border: "1px dashed grey",
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
                            <PhotoCamera />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Field
                        as={TextField}
                        name={`variants[${index}].name`}
                        label="Nombre de presentación"
                        fullWidth
                        margin="normal"
                        required
                        error={
                          getIn(touched, `variants[${index}].name`) &&
                          Boolean(getIn(errors, `variants[${index}].name`))
                        }
                        helperText={
                          getIn(touched, `variants[${index}].name`) &&
                          getIn(errors, `variants[${index}].name`)
                        }
                      />
                      <Field
                        as={TextField}
                        name={`variants[${index}].description`}
                        label="Descripción"
                        fullWidth
                        margin="normal"
                      />
                      <Field
                        name={`variants[${index}].price`}
                        component={NumberInput}
                        label="Precio"
                        required
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
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
          )}
        </FieldArray>
      )}
    </Box>
  );
};

export default VariationsSection;
