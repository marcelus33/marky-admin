// src/services/errorMapper.ts (ejemplo)

import { AxiosError } from "axios";
import { DRFErrorResponse } from "./types";

export function mapAxiosError(error: AxiosError<DRFErrorResponse>) {
  // Si no hay response, puede ser un problema de red o un timeout
  if (!error.response) {
    return {
      message: "Error de conexión o respuesta no recibida",
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
    message: message || "Ha ocurrido un error",
    status: status,
    success: data?.success !== undefined ? data?.success : false,
    errors: !(data?.error || data?.detail) ? data : null,
  };
}
