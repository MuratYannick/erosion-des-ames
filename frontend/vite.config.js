import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration Vite pour React + TailwindCSS v3
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true, // Ouvre automatiquement le navigateur
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
