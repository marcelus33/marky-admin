import { MediaItemLocal } from "../types/product";
import { validateMedia } from "./mediaValidation";

const makeFile = (
  name: string,
  type: string,
  sizeBytes: number,
): File => {
  const file = new File([new Uint8Array(sizeBytes)], name, { type });
  return file;
};

describe("validateMedia", () => {
  it("accepts a valid image and video within limits", () => {
    const files = [
      makeFile("photo.jpg", "image/jpeg", 1024),
      makeFile("clip.mp4", "video/mp4", 1024),
    ];
    expect(validateMedia(files, [])).toBeNull();
  });

  it("rejects more than 4 total files", () => {
    const activeMedia: MediaItemLocal[] = [
      { file: "url1", media_type: "image" },
      { file: "url2", media_type: "image" },
      { file: "url3", media_type: "image" },
    ];
    const files = [makeFile("photo.jpg", "image/jpeg", 1024), makeFile("photo2.jpg", "image/jpeg", 1024)];
    expect(validateMedia(files, activeMedia)).toBe(
      "No se pueden seleccionar más de 4 archivos en total.",
    );
  });

  it("rejects more than 3 images", () => {
    const activeMedia: MediaItemLocal[] = [
      { file: "url1", media_type: "image" },
      { file: "url2", media_type: "image" },
      { file: "url3", media_type: "image" },
    ];
    const files = [makeFile("photo.jpg", "image/jpeg", 1024)];
    expect(validateMedia(files, activeMedia)).toBe(
      "No se pueden seleccionar más de 3 imágenes.",
    );
  });

  it("rejects more than 1 video", () => {
    const activeMedia: MediaItemLocal[] = [{ file: "url1", media_type: "video" }];
    const files = [makeFile("clip.mp4", "video/mp4", 1024)];
    expect(validateMedia(files, activeMedia)).toBe(
      "No se puede seleccionar más de 1 video.",
    );
  });

  it("rejects an unsupported image format", () => {
    const files = [makeFile("photo.gif", "image/gif", 1024)];
    expect(validateMedia(files, [])).toBe(
      "Formato no permitido para photo.gif. Usa JPG, PNG o WebP.",
    );
  });

  it("rejects an unsupported video format", () => {
    const files = [makeFile("clip.avi", "video/x-msvideo", 1024)];
    expect(validateMedia(files, [])).toBe(
      "Formato no permitido para clip.avi. Usa MP4, MOV o WebM.",
    );
  });

  it("accepts a .mov file (video/quicktime)", () => {
    const files = [makeFile("clip.mov", "video/quicktime", 1024)];
    expect(validateMedia(files, [])).toBeNull();
  });

  it("rejects a file with an unrecognized/empty MIME type instead of silently passing it through", () => {
    // Some formats (e.g. .avi) can report an empty file.type in the browser;
    // this must not slip past validation by matching neither image nor video.
    const files = [makeFile("clip.avi", "", 1024)];
    expect(validateMedia(files, [])).toBe(
      "Formato no permitido para clip.avi. Usa JPG, PNG, WebP, MP4, MOV o WebM.",
    );
  });

  it("rejects an image over 5MB", () => {
    const files = [makeFile("big.jpg", "image/jpeg", 5 * 1024 * 1024 + 1)];
    expect(validateMedia(files, [])).toBe(
      "La imagen big.jpg supera el peso máximo permitido. Máximo permitido: 5MB.",
    );
  });

  it("accepts an image at exactly 5MB", () => {
    const files = [makeFile("boundary.jpg", "image/jpeg", 5 * 1024 * 1024)];
    expect(validateMedia(files, [])).toBeNull();
  });

  it("rejects a video over 80MB", () => {
    const files = [makeFile("big.mp4", "video/mp4", 80 * 1024 * 1024 + 1)];
    expect(validateMedia(files, [])).toBe(
      "El video big.mp4 supera el peso máximo permitido. Máximo permitido: 80MB.",
    );
  });

  it("accepts a video at exactly 80MB", () => {
    const files = [makeFile("boundary.mp4", "video/mp4", 80 * 1024 * 1024)];
    expect(validateMedia(files, [])).toBeNull();
  });
});
