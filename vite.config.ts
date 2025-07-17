import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import symfonyPlugin from "vite-plugin-symfony";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
    optimizeDeps: {
      exclude: ["zod"],
    },
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
    plugins: [
        symfonyPlugin(),
        tailwindcss(),
        // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
            routesDirectory: "assets/admin/routes",
            generatedRouteTree: "assets/admin/routeTree.gen.ts",
        }),
        react(),
        checker({
            typescript: {
                tsconfigPath: './tsconfig.app.json',
            }
        }),
    ],
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
                admin: "./assets/admin/main.tsx",
            },
        },
    },
});
