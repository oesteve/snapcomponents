import path from "path";
import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import symfonyPlugin from "vite-plugin-symfony";

// https://vite.dev/config/
export default defineConfig({
    server: {
        watch: {
            ignored: [
                "**/node_modules/**",
                "**/vendor/**",
                "**/var/**",
                "**/public/**",
                "**/src/**",
                "**/bin/**",
                "**/config/**",
                "**/docker/**",
                "**/docs/**",
                "**/migrations/**",
            ],
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
                app: "./assets/index.ts",
                widgets: "./assets/widgets/index.ts",
                admin: "./assets/pages/admin/index.tsx",
            },
        },
    },
});
