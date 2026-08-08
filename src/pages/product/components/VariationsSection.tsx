import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Field, FieldArray, FormikProps, getIn } from "formik";
import NumberInput from "../../../components/NumberInput";
import { useBusinessAccountInfo } from "../../../hooks/useBusinessAccountInfo";
import { useImageCropper } from "../../../hooks/useImageCropper";
import ImageCropModal from "../../../components/ImageCropModal";
import Input from "../../../components/Input";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ReactComponent as AddVariationImageIcon } from "../../../assets/icons/product-form/add-variation-picture.svg";

// Renders a variant's image preview. Previously this was done inline with
// `URL.createObjectURL(variant.image)` called directly during render: it
// created a brand-new blob URL (and leaked the previous one, since it was
// never revoked) on every single render of the form, and would throw if
// `variant.image` was ever something other than a File/Blob/string (which
// would surface as an uncaught render error). This component instead only
// creates/revokes the object URL when the underlying image actually changes,
// and falls back to rendering nothing instead of throwing for unexpected
// values.
const VariantImagePreview: React.FC<{ image: unknown }> = ({ image }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setUrl(null);
      return;
    }
    if (typeof image === "string") {
      setUrl(image);
      return;
    }
    if (image instanceof File || image instanceof Blob) {
      const objectUrl = URL.createObjectURL(image);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    // Unsupported shape: don't crash the render, just show the placeholder.
    setUrl(null);
  }, [image]);

  if (!url) return null;
  return (
    <img
      src={url}
      alt="Variant"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

interface VariationsSectionProps extends FormikProps<any> {
  maxItems?: number;
  // Lifted up to ProductFormPage so the "Activar multi presentaciones"
  // selection survives switching to another tab and back (switching tabs
  // unmounts this component, which would otherwise reset any local state
  // back to its default).
  multiPresentation: boolean;
  onMultiPresentationChange: (value: boolean) => void;
}

const VariationsSection: React.FC<VariationsSectionProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
  handleChange,
  handleBlur,
  maxItems = 10,
  multiPresentation,
  onMultiPresentationChange,
}) => {
  const { data: businessAccountInfo } = useBusinessAccountInfo();
  const currencyCode = businessAccountInfo?.primary_currency_code;
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
            onChange={(e) => onMultiPresentationChange(e.target.checked)}
          />
        }
        label="Activar presentaciones múltiples"
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
                        <VariantImagePreview image={variant.image} />
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
                        endAdornment: currencyCode ? (
                          <InputAdornment position="end">
                            <Typography variant="body2">{`[${currencyCode}]`}</Typography>
                          </InputAdornment>
                        ) : undefined,
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 4,
                  cursor:
                    values.variants.length >= maxItems ? "default" : "pointer",
                }}
                onClick={() => {
                  if (values.variants.length >= maxItems) return;
                  push({
                    id: Date.now(),
                    name: "",
                    description: "",
                    price: "",
                    image: null,
                  });
                }}
              >
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
                <Button disabled={values.variants.length >= maxItems}>
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
