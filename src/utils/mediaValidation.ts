import { MediaItemLocal } from "../types/product";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 80 * 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
// .mov files report as video/quicktime in browsers, not video/mov.
export const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

/**
 * Validates a batch of newly-selected product media files against the
 * existing (not-yet-deleted) media already on the product: total/type
 * counts, allowed formats, and max size per type. Returns a user-facing
 * error message, or null if the batch is valid.
 */
export const validateMedia = (
  files: File[],
  activeMedia: MediaItemLocal[],
): string | null => {
  const totalFiles = activeMedia.length + files.length;
  if (totalFiles > 4) return "No se pueden seleccionar más de 4 archivos en total.";

  // Reject unrecognized MIME types up front (e.g. an empty file.type, which
  // browsers report for some formats like .avi): otherwise they'd match
  // neither the image nor the video branch below and skip validation
  // entirely instead of being rejected.
  for (const file of files) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      return `Formato no permitido para ${file.name}. Usa JPG, PNG, WebP, MP4, MOV o WebM.`;
    }
  }

  const imageCount =
    activeMedia.filter((item) => item.media_type === "image").length +
    files.filter((file) => file.type.startsWith("image/")).length;
  if (imageCount > 3) return "No se pueden seleccionar más de 3 imágenes.";

  const videoCount =
    activeMedia.filter((item) => item.media_type === "video").length +
    files.filter((file) => file.type.startsWith("video/")).length;
  if (videoCount > 1) return "No se puede seleccionar más de 1 video.";

  for (const file of files) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (isImage && !ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      return `Formato no permitido para ${file.name}. Usa JPG, PNG o WebP.`;
    }
    if (isVideo && !ALLOWED_VIDEO_MIME_TYPES.includes(file.type)) {
      return `Formato no permitido para ${file.name}. Usa MP4, MOV o WebM.`;
    }
    if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
      return `La imagen ${file.name} supera el peso máximo permitido. Máximo permitido: 5MB.`;
    }
    if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
      return `El video ${file.name} supera el peso máximo permitido. Máximo permitido: 80MB.`;
    }
  }

  return null;
};
