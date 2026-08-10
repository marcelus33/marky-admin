import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AddPhotoAlternate as AddPhotoIcon } from "@mui/icons-material";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Box, Button, Grid, List, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import NoPicturesImage from "../../../assets/images/producto_sin_imagenes.png";
import ImageCropModal from "../../../components/ImageCropModal";
import { useImageCropper } from "../../../hooks/useImageCropper";
import { MediaItemLocal, Product } from "../../../types/product";
import { generateThumbnail } from "../../../utils/media";
import { validateMedia } from "../../../utils/mediaValidation";
import { ShowNotification } from "../../../utils/utils";
import { SortableImageItem } from "./SortableImageItem";
import { ThumbnailItem } from "./ThumbnailItem";

const ProductImageGallery = () => {
  const { values, setFieldValue } = useFormikContext<Product>();
  const { media = [] } = values;
  const [selectedItem, setSelectedItem] = useState<MediaItemLocal | null>(
    media[0],
  );
  const [videoThumbnail, setVideoThumbnail] = useState<string | undefined>(
    undefined,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeMediaId, setActiveMediaId] = useState<string | number | null>(
    null,
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
    if (activeMediaId !== null) {
      handleCrop(activeMediaId, croppedImage);
    }
  });
  useEffect(() => {
    if (selectedItem?.media_type === "video" && selectedItem.file) {
      const file = selectedItem.file;
      const isFile =
        file &&
        typeof file === "object" &&
        "name" in file &&
        "size" in file &&
        "type" in file;

      if (isFile) {
        generateThumbnail(URL.createObjectURL(file as File))
          .then((thumb) => {
            setVideoThumbnail(thumb);
          })
          .catch((error) => {
            console.error("Error generating thumbnail:", error);
            setVideoThumbnail(undefined);
          });
      } else if (typeof file === "string") {
        setVideoThumbnail(undefined);
      }
    } else {
      setVideoThumbnail(undefined);
    }
  }, [selectedItem]);

  useEffect(() => {
    const activeMedia = media.filter((item: any) => !item._delete);

    // If there are no active items, clear selection
    if (activeMedia.length === 0) {
      setSelectedItem(null);
      return;
    }

    // If nothing selected, pick the first active item
    if (!selectedItem) {
      setSelectedItem(activeMedia[0]);
      return;
    }

    // If selected item was removed/marked deleted, pick first active item
    const stillActive = activeMedia.find(
      (item: any) => item.id === selectedItem.id,
    );
    if (!stillActive) {
      setSelectedItem(activeMedia[0] || null);
    }
  }, [media, selectedItem]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files) return;

      const newMedia = Array.from(files);
      const activeMedia = media.filter((m) => !m._delete);
      const validationError = validateMedia(newMedia, activeMedia);
      if (validationError) {
        ShowNotification({ message: validationError, type: "error" });
        return;
      }

      const newItems = newMedia.map((file, index) => ({
        id: Date.now() + index,
        file: file,
        originalFile: file,
        name: file.name,
        media_type: file.type.startsWith("image/") ? "image" : "video",
        product: 0,
        isNew: true,
      }));

      setFieldValue("media", [...media, ...newItems]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error en handleFileChange:", error);
      ShowNotification({
        message: "Error al procesar los archivos",
        type: "error",
      });
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    try {
      const { active, over } = event;
      if (!over) return;
      if (active.id !== over.id) {
        const oldIndex = media.findIndex(
          (item: any) => item.id.toString() === String(active.id),
        );
        const newIndex = media.findIndex(
          (item: any) => item.id.toString() === String(over.id),
        );
        if (oldIndex === -1 || newIndex === -1) return;
        const newItems = arrayMove(media, oldIndex, newIndex);
        setFieldValue(
          "media",
          newItems.map((item: any, index: number) => ({
            ...item,
            order: index,
          })),
        );
      }
    } catch (error) {
      console.error("Error en handleDragEnd:", error);
    }
  }

  const handleDelete = (id: string | number) => {
    const newMedia = media
      .map((item: any) => {
        if (item.id === Number(id)) {
          if (item.isNew) {
            return null; // remove new uploads entirely
          }
          return { ...item, _delete: true }; // mark backend items as deleted
        }
        return item;
      })
      .filter(Boolean);

    setFieldValue("media", newMedia);

    // Update selected preview if needed
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(newMedia[0] || null);
    }
  };

  const handleCrop = (id: string | number, file: File) => {
    const newMedia = media.map((item: any) => {
      if (item.id.toString() === id.toString()) {
        return { ...item, file: file, name: file.name };
      }
      return item;
    });
    setFieldValue("media", newMedia);
  };

  const handleOpenCropModalWithId = (id: string | number) => {
    const mediaToCrop = media.find(
      (item: any) => item.id.toString() === id.toString(),
    );
    if (mediaToCrop) {
      setActiveMediaId(id);
      const fileToCrop = mediaToCrop.originalFile || mediaToCrop.file;
      handleOpenCropModal(fileToCrop);
    }
  };

  const getImageUrl = (item: any): string => {
    try {
      if (!item || !item.file) return "";

      const file = item.file;
      const isFile = file && typeof file === "object" && "name" in file;

      if (item.media_type === "image" || item.media_type === "video") {
        if (isFile) {
          return URL.createObjectURL(file as File);
        }
        return typeof file === "string" ? file : "";
      }

      return "";
    } catch (error) {
      console.error("Error en getImageUrl:", error, item);
      return "";
    }
  };

  const itemsWithUrls = React.useMemo(() => {
    return media
      .filter((item: any) => !item._delete)
      .map((item: any) => {
        const file = item.file;
        const isFile = file && typeof file === "object" && "name" in file;
        const fileName =
          item.name ||
          (isFile
            ? (file as File).name
            : typeof file === "string"
              ? file
              : "Sin nombre");

        return {
          id: item.id.toString(),
          name: fileName,
          type: item.media_type,
          url: typeof file === "string" ? file : "",
          file: file,
        };
      });
  }, [media]);

  return (
    <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, padding: 5 }}>
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
      <Box
        sx={{
          display: "flex",
          // border: "1px solid",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { md: "center" },
          mb: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CollectionsIcon />
          <Typography variant="h6" fontWeight="bold">
            Galería de tu producto
          </Typography>
        </Box>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {!!selectedItem && (
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: { xs: "100%", md: "auto" },
              padding: "8px 12px 8px 12px",
              backgroundColor: "#EDEDED",
              color: "#4B4B4B",
              boxShadow: 0,
            }}
            startIcon={<AddPhotoIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Agregar contenido multimedia
          </Button>
        )}
      </Box>
      {/* DISPLAY WHEN EMPTY */}
      {!selectedItem && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <img
            src={NoPicturesImage}
            alt="Producto sin imagenes"
            style={{
              width: "300px",
              height: "300px",
              objectFit: "contain",
            }}
          />

          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: { xs: "100%", md: "auto" },
              padding: "8px 12px 8px 12px",
              backgroundColor: "#EDEDED",
              color: "#4B4B4B",
              boxShadow: 0,
            }}
            startIcon={<AddPhotoIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Agregar contenido multimedia
          </Button>
        </Box>
      )}
      {/* ACTUAL GRID FOR THE IMAGES COMPONENT */}
      {!!selectedItem && (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 4, md: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  justifyContent: { xs: "center", md: "start" },
                  alignContent: "space-around",
                  gap: 4,
                  alignItems: "flex-start",
                  paddingX: 2,
                  order: { xs: 2, md: 1 },
                }}
              >
                {media
                  .filter((item: any) => !item._delete)
                  .map((item: any) => (
                    <ThumbnailItem
                      key={item.id}
                      item={item}
                      onClick={() => setSelectedItem(item)}
                      isSelected={selectedItem?.id === item.id}
                    />
                  ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  height: "350px",
                  width: "100%",
                  order: { xs: 1, md: 2 },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      md: "90%",
                    },
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    border: "1px solid",
                    borderColor: "grey.400",
                    borderRadius: 2,
                    padding: 5,
                  }}
                >
                  {!selectedItem ? (
                    <></>
                  ) : selectedItem.media_type === "image" ? (
                    <img
                      src={getImageUrl(selectedItem)}
                      alt={selectedItem.name || "Product image"}
                      style={{
                        borderRadius: 10,
                        width: "300px",
                        height: "300px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <video
                      src={getImageUrl(selectedItem)}
                      controls
                      poster={videoThumbnail}
                      style={{
                        width: "260px",
                        height: "260px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* ================ SORTABLE LIST COLUMN ================ */}
          <Grid item xs={12} md={6}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={media
                  .filter((item: any) => !item._delete)
                  .map((item: any) => item.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <List
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 0,
                  }}
                >
                  {itemsWithUrls.map((item: any) => (
                    <SortableImageItem
                      key={item.id}
                      item={item}
                      onDelete={handleDelete}
                      onOpenCropModal={
                        item.type === "image"
                          ? handleOpenCropModalWithId
                          : () => {}
                      }
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProductImageGallery;
