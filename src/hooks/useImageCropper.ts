import { useState, useEffect } from "react";
import { Area, Point } from "react-easy-crop";
import { ShowNotification } from "../utils/utils";
import getCroppedImg from "../utils/cropImage";

export const useImageCropper = (onCropComplete: (file: File) => void) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppingMedia, setCroppingMedia] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    // Cleanup function to revoke URL on unmount
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleOpenCropModal = (media: any) => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppingMedia(media);
    setImageUrl(URL.createObjectURL(media));
  };

  const handleCloseCropModal = () => {
    setCroppingMedia(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl("");
  };

  const handleApplyCrop = async () => {
    if (!croppingMedia || !croppedAreaPixels) return;

    try {
      const croppedImageFile = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropComplete(croppedImageFile);
      handleCloseCropModal();
    } catch (error) {
      console.error("Error applying crop:", error);
      ShowNotification({
        message: "Error al recortar la imagen",
        type: "error",
      });
    }
  };

  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  return {
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
  };
};
