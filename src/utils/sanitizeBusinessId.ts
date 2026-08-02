// Normalizes free-typed text into a valid business_id slug.
export const sanitizeBusinessId = (raw: string): string => {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
};
