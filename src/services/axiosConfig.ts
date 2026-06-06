import axios from "axios";
import { useSessionStore } from "../stores/sessionStore";
import { mapAxiosError } from "./errorMapper";

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
    console.log("axios error", error);
    console.log("err response ==>", error.response);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, setSession, clearSession } =
        useSessionStore.getState();

      try {
        if (refreshToken) {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/users/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          // Actualiza los tokens en el store preservando el usuario actual
          const { user } = useSessionStore.getState();
          setSession({
            accessToken: data.access,
            refreshToken,
            user,
          });

          // Añade el nuevo token al header y reintenta la solicitud original
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error al refrescar el token:", refreshError);
        clearSession(); // Limpia la sesión si el refresh falla
        window.location.href = "/login"; // Redirige al login
      }
    }
    const mappedError = mapAxiosError(error);
    return Promise.reject(mappedError);
  }
);

export default api;
