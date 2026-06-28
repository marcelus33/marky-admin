import { AxiosError } from "axios";
import { mapAxiosError } from "./errorMapper";
import { DRFErrorResponse } from "./types";

const buildError = (
  response?: AxiosError<DRFErrorResponse>["response"]
): AxiosError<DRFErrorResponse> =>
  ({ response } as AxiosError<DRFErrorResponse>);

describe("mapAxiosError", () => {
  it("returns a network-error shape when there is no response", () => {
    const result = mapAxiosError(buildError(undefined));

    expect(result).toEqual({
      message: "Error de conexión o respuesta no recibida",
      status: 0,
      success: false,
      errors: null,
    });
  });

  it("prefers data.error as the message and clears errors", () => {
    const result = mapAxiosError(
      buildError({
        status: 400,
        data: { error: "Credenciales inválidas", message: "fallback" },
      } as AxiosError<DRFErrorResponse>["response"])
    );

    expect(result.message).toBe("Credenciales inválidas");
    expect(result.status).toBe(400);
    expect(result.errors).toBeNull();
  });

  it("falls back to data.detail when there is no data.error", () => {
    const result = mapAxiosError(
      buildError({
        status: 401,
        data: { detail: "No autorizado", message: "fallback" },
      } as AxiosError<DRFErrorResponse>["response"])
    );

    expect(result.message).toBe("No autorizado");
    expect(result.errors).toBeNull();
  });

  it("falls back to data.message when there is no error or detail", () => {
    const result = mapAxiosError(
      buildError({
        status: 500,
        data: { message: "Server error" },
      } as AxiosError<DRFErrorResponse>["response"])
    );

    expect(result.message).toBe("Server error");
  });

  it("falls back to a generic message when nothing is present", () => {
    const result = mapAxiosError(
      buildError({
        status: 500,
        data: {} as DRFErrorResponse,
      } as AxiosError<DRFErrorResponse>["response"])
    );

    expect(result.message).toBe("Ha ocurrido un error");
  });

  it("defaults success to false when data.success is undefined", () => {
    const result = mapAxiosError(
      buildError({
        status: 400,
        data: {} as DRFErrorResponse,
      } as AxiosError<DRFErrorResponse>["response"])
    );

    expect(result.success).toBe(false);
  });

  it("passes through data.success when provided", () => {
    const result = mapAxiosError(
      buildError({
        status: 200,
        data: { success: true } as DRFErrorResponse,
      } as AxiosError<DRFErrorResponse>["response"])
    );

    expect(result.success).toBe(true);
  });

  it("passes through field errors when there is no error/detail message", () => {
    const data = {
      message: "Validación fallida",
      errors: { email: ["Requerido"] },
    } as DRFErrorResponse;

    const result = mapAxiosError(
      buildError({
        status: 400,
        data,
      } as AxiosError<DRFErrorResponse>["response"])
    );

    expect(result.errors).toEqual(data);
  });
});
