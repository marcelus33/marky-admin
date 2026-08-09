import axios from "axios";
import { useSessionStore } from "../stores/sessionStore";
import { mapAxiosError } from "./errorMapper";
import { ShowNotification } from "../utils/utils";

const SESSION_EXPIRED_MESSAGE =
  "Tu sesión expiró. Guarda o copia la información antes de volver a iniciar sesión.";

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

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, setSession, clearSession } =
        useSessionStore.getState();

      if (!refreshToken) {
        // No hay refresh token disponible (p. ej. tras recargar la página):
        // cerrar sesión. NO usamos window.location.href aquí: es una
        // navegación dura de página completa, que dispara el diálogo nativo
        // `beforeunload` cuando hay un formulario con cambios sin guardar
        // (p. ej. subiendo un video en /product/edit/:id). clearSession()
        // se ejecuta de forma síncrona ANTES de que el navegador resuelva
        // ese diálogo, así que aunque el usuario presione "Cancelar" para
        // quedarse, la sesión ya quedó destruida. App.tsx ya redirige a
        // /login de forma reactiva en cuanto `isAuthenticated()` pasa a
        // false (ver rutas protegidas), así que basta con limpiar la
        // sesión y avisar al usuario.
        clearSession();
        ShowNotification({ message: SESSION_EXPIRED_MESSAGE, type: "warning" });
      } else {
        try {
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
          const { user } = useSessionStore.getState();
          setSession({
            accessToken: data.access,
            refreshToken: data.refresh,
            user,
          });

          // Añade el nuevo token al header y reintenta la solicitud original
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Error al refrescar el token:", refreshError);
          // Mismo motivo que arriba: sin window.location.href. La
          // redirección la maneja App.tsx reactivamente.
          clearSession(); // Limpia la sesión si el refresh falla
          ShowNotification({ message: SESSION_EXPIRED_MESSAGE, type: "warning" });
        }
      }
    }
    const mappedError = mapAxiosError(error);
    return Promise.reject(mappedError);
  }
);

export default api;
