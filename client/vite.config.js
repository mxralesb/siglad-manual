import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:3001",
      "/users": "http://localhost:3001",
      "/declarations": "http://localhost:3001",
      "/validation": "http://localhost:3001",
      "/status": "http://localhost:3001",
      "/catalogs": "http://localhost:3001",
      "/admin": "http://localhost:3001"
    }
  }
});
