import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server proxies /api and /uploads to the Express backend so the
// frontend can just call relative paths (no CORS juggling in dev).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
  },
});
