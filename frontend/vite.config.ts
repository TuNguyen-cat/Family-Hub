import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Khi build production (chạy 1 server Django), các asset dùng base /static/
  // để Django phục vụ được. Ở chế độ dev vẫn giữ base mặc định.
  base: mode === "development" ? "/" : "/static/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../backend/static/frontend",
    emptyOutDir: true,
  },
}))