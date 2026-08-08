// Applies live, per-keystroke normalization but leaves edge hyphens alone: on
// a controlled input, trimming a trailing "-" immediately would eat the word
// separator before the next word is typed (e.g. "cafe" + " " -> "cafe-" would
// get trimmed back to "cafe" before "postres" arrives).
export const sanitizeBusinessIdLive = (raw: string): string => {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "")
    .replace(/-+/g, "-");
};

// Full normalization into a valid business_id slug: live rules plus trimming
// leading/trailing hyphens. Use for one-shot sanitization (on blur, before
// submit) once the user has finished typing.
export const sanitizeBusinessId = (raw: string): string => {
  return sanitizeBusinessIdLive(raw).replace(/^-+|-+$/g, "");
};
