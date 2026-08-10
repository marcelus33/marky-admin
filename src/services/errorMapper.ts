// src/services/errorMapper.ts (ejemplo)

import { AxiosError } from "axios";
import { DRFErrorResponse } from "./types";

export function mapAxiosError(error: AxiosError<DRFErrorResponse>) {
  // Si no hay response, puede ser un problema de red o un timeout
  if (!error.response) {
    // axios marca los timeouts del lado del cliente con este código, a
    // diferencia de una falla de red genérica (sin conexión, CORS, etc.).
    if (error.code === "ECONNABORTED") {
      return {
        message:
          "No se pudo completar la carga: se agotó el tiempo de espera. Revisa tu conexión e intenta nuevamente.",
        status: 0,
        success: false,
        errors: null,
      };
    }
    return {
      message:
        "No se pudo completar la carga. Revisa tu conexión e intenta nuevamente.",
      status: 0,
      success: false,
      errors: null,
    };
  }

  const { data, status } = error.response;
  // DRF wraps ValidationError details in a list even for a single message
  // (e.g. {"error": ["texto"]}). react-toastify's toast() silently no-ops
  // when given anything that isn't a string/element/function/number, so an
  // unwrapped array here means the error toast never renders. Unwrap it.
  const rawMessage = data?.error || data?.detail || data?.message;
  const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

  return {
    // Nested serializer fields (e.g. product media validation errors) don't
    // have a top-level error/detail/message key — DRF's default shape for
    // those is e.g. {"media": [{"file": ["El video supera..."]}]}. Without
    // this fallback, a specific backend validation message (the whole point
    // of validating file size/format server-side) would be silently
    // replaced by a generic one.
    message: message || extractFirstNestedError(data) || "Ha ocurrido un error",
    status: status,
    success: data?.success !== undefined ? data?.success : false,
    errors: !(data?.error || data?.detail) ? data : null,
  };
}

/**
 * Recursively finds the first error string inside a DRF nested-serializer
 * error payload (arbitrarily nested objects/arrays of strings).
 */
function extractFirstNestedError(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractFirstNestedError(item);
      if (found) return found;
    }
    return undefined;
  }
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      const found = extractFirstNestedError((value as Record<string, unknown>)[key]);
      if (found) return found;
    }
  }
  return undefined;
}
