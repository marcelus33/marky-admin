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
  console.log("mapAxiosError e.response", error.response);
  return {
    message:
      data?.error || data?.detail || data?.message || "Ha ocurrido un error",
    status: status,
    success: data?.success !== undefined ? data?.success : false,
    errors: !(data?.error || data?.detail) ? data : null,
  };
}
