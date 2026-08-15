import axios from "axios";
import { useSessionStore } from "../stores/sessionStore";
import { mapAxiosError } from "./errorMapper";
import { ShowNotification } from "../utils/utils";

const SESSION_EXPIRED_MESSAGE =
  "Tu sesión expiró. Inicia sesión nuevamente para continuar.";
const SESSION_EXPIRED_TOAST_ID = "session-expired";

// Endpoints de auth cuyos 401 son respuestas de negocio normales (p. ej.
// credenciales inválidas en login), no una sesión expirada — nunca deben
// disparar el flujo de refresh/clearSession/toast de abajo.
const AUTH_ENDPOINTS = ["/users/login/"];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // URL base desde el .env
  timeout: 30000, // Tiempo límite para las solicitudes
});

// Interceptor para solicitudes
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useSessionStore.getState(); // Obtén el access token desde el store
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers["Accept-Language"] = "es";
    return config;
  },
  (error) => Promise.reject(error)
);

// Comparte una única promesa de refresh entre solicitudes 401 concurrentes
// (p. ej. varios queries disparados a la vez en una misma pantalla), para no
// disparar un refresh por cada una ni pisarse los tokens rotados entre sí.
let refreshPromise: Promise<string> | null = null;

// Evita apilar varios toasts idénticos cuando más de una solicitud falla por
// sesión expirada. Se resetea al iniciar una sesión nueva (ver
// resetSessionExpiredNotice, llamado desde Logout).
let sessionExpiredNotified = false;

export function resetSessionExpiredNotice() {
  sessionExpiredNotified = false;
}

function notifySessionExpired() {
  if (sessionExpiredNotified) return;
  sessionExpiredNotified = true;
  ShowNotification({
    message: SESSION_EXPIRED_MESSAGE,
    type: "warning",
    toastId: SESSION_EXPIRED_TOAST_ID,
  });
}

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, user, setSession } = useSessionStore.getState();

  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/users/token/refresh/`,
    {
      refresh: refreshToken,
    }
  );

  // Actualiza los tokens en el store preservando el usuario actual.
  // El backend tiene ROTATE_REFRESH_TOKENS activado: cada refresh
  // devuelve un refresh token nuevo y el usado queda inválido, así
  // que hay que guardar data.refresh (no seguir reusando el viejo).
  setSession({
    accessToken: data.access,
    refreshToken: data.refresh,
    user,
  });

  return data.access;
}

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      const { refreshToken, clearSession } = useSessionStore.getState();

      if (!refreshToken) {
        // No hay refresh token disponible: cerrar sesión. NO usamos
        // window.location.href aquí: es una navegación dura de página
        // completa, que dispara el diálogo nativo `beforeunload` cuando hay
        // un formulario con cambios sin guardar (p. ej. subiendo un video en
        // /product/edit/:id). clearSession() se ejecuta de forma síncrona
        // ANTES de que el navegador resuelva ese diálogo, así que aunque el
        // usuario presione "Cancelar" para quedarse, la sesión ya quedó
        // destruida. App.tsx ya redirige a /login de forma reactiva en
        // cuanto `isAuthenticated()` pasa a false (ver rutas protegidas),
        // así que basta con limpiar la sesión y avisar al usuario.
        clearSession();
        notifySessionExpired();
      } else {
        try {
          if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
              refreshPromise = null;
            });
          }
          const newAccessToken = await refreshPromise;

          // Añade el nuevo token al header y reintenta la solicitud original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Error al refrescar el token:", refreshError);
          // Mismo motivo que arriba: sin window.location.href. La
          // redirección la maneja App.tsx reactivamente.
          clearSession(); // Limpia la sesión si el refresh falla
          notifySessionExpired();
        }
      }
    }
    const mappedError = mapAxiosError(error);
    return Promise.reject(mappedError);
  }
);

export default api;
