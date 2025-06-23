import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import symfonyPlugin from "vite-plugin-symfony";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    watch: {
      ignored: ["**/node_modules/**", "vendor/**", "src/**"],
    },
  },
  plugins: [symfonyPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@/translations": path.resolve(__dirname, "var/translations"),
      "@": path.resolve(__dirname, "assets"),
    },
  },
  build: {
    rollupOptions: {
      // overwrite default .html entry
      input: {
        app: "./assets/app.ts",
      },
    },
  },
});
