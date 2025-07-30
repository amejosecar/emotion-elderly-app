// C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\api\axios.ts
// frontend/src/api/axios.ts

import axios from "axios";

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Añadir token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo de errores globales
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es un intento de refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const res = await api.post("/auth/refresh");
        const newToken = res.data.access_token;

        // Guardar nuevo token y reintentar la petición original
        localStorage.setItem("access_token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, limpiar y redirigir
        localStorage.removeItem("access_token");
        alert("⚠️ Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
