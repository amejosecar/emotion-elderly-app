// C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\api\axios.ts
// frontend/src/api/axios.ts

import axios from "axios";

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "multipart/form-data", // Ideal para subir archivos
  },
});

// Interceptor para añadir el token Bearer si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Error en interceptor de axios:", error);
    return Promise.reject(error);
  }
);

export default api;
