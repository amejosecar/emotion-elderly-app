// C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\api\axios.ts
// frontend/src/api/axios.ts
// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

// Interceptor que añade el Bearer token si existe
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
