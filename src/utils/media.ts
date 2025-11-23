type MediaElement = HTMLImageElement | HTMLVideoElement;

export const createMediaElement = <T extends MediaElement>(
  url: string,
  type: "image" | "video"
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const element =
      type === "image"
        ? new Image()
        : (document.createElement("video") as HTMLVideoElement);
    element.src = url;
    element.crossOrigin = "anonymous";

    const eventToListen = type === "image" ? "load" : "loadeddata";

    element.addEventListener(eventToListen, () => resolve(element as T));
    element.addEventListener("error", (error) => reject(error));
  });
};

export const generateThumbnail = async (videoUrl: string): Promise<string> => {
  const video = await createMediaElement<HTMLVideoElement>(videoUrl, "video");
  video.currentTime = 2; // frame a los 2 segundos

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
};
