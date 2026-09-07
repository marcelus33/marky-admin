import { useEffect, useState } from "react";

// Resolves a media item's `file` to a displayable URL: a remote URL string
// is returned as-is; a File/Blob gets a browser object URL created once (on
// mount and whenever `file` changes) and revoked on cleanup — so repeated
// re-renders (e.g. every keystroke elsewhere in the form) don't leak a new
// blob URL each time. Mirrors the effect+cleanup pattern already used by
// VariantImagePreview in VariationsSection.tsx.
export const useMediaObjectUrl = (
  file: File | Blob | string | null | undefined,
): string => {
  const [url, setUrl] = useState<string>(
    typeof file === "string" ? file : "",
  );

  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }
    if (typeof file === "string") {
      setUrl(file);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
};
