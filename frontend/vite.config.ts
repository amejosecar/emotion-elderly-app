// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Preempaqueta jwt-decode como ESM para que exponga default()
  optimizeDeps: {
    include: ["jwt-decode"],
  },

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  server: {
    host: true,
    port: 5173,
    open: true,
  },
});
