const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const objectToFormData = (
  obj: any,
  formData = new FormData(),
  parentKey = ""
): FormData => {
  if (obj === null || obj === undefined) return formData;

  const isFile = (v: any) => v instanceof File || v instanceof Blob;
  const isPrimitive = (v: any) =>
    typeof v !== "object" || v instanceof Date || isFile(v);

  // Primitive, File, or Date
  if (isPrimitive(obj)) {
    if (!parentKey) throw new Error("Cannot append value without a key");
    formData.append(parentKey, obj instanceof Date ? obj.toISOString() : obj);
    return formData;
  }

  // Array
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = `${parentKey}[${index}]`;
      objectToFormData(item, formData, key);
    });
    return formData;
  }

  // Object
  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    // convert camelCase keys to snake_case for backend
    const formattedKey = camelToSnakeCase(key);
    const newParentKey = parentKey
      ? `${parentKey}[${formattedKey}]`
      : formattedKey;

    // === Special cases (safeguards) ===
    // 1) If this is the _delete flag and it's truthy, append it (backend expects it)
    if (key === "_delete" && value === true) {
      if (!formData.has(newParentKey)) {
        formData.append(newParentKey, "true");
      }
      return;
    }

    // 2) If this is a file field but value is a URL string, skip it
    if ((key === "file" || key === "image") && typeof value === "string") {
      // skip string URLs — they are not upload files
      return;
    }

    // 3) If value is null/undefined, skip
    if (value === null || typeof value === "undefined") {
      return;
    }

    // Recurse for everything else
    objectToFormData(value, formData, newParentKey);
  });

  return formData;
};

export const urlToFile = async (
  url: string,
  filename: string,
  mimeType?: string
): Promise<File> => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
};
