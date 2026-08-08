// Los usuarios suelen escribir su dominio sin protocolo (www.marky.one); se
// completa con https:// para guardar una URL válida.
export const normalizeWebsiteUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const isValidWebsiteUrl = (value = ""): boolean => {
  if (!value.trim()) return false;
  try {
    // eslint-disable-next-line no-new
    new URL(normalizeWebsiteUrl(value));
    return true;
  } catch {
    return false;
  }
};
