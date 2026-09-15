import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", { target: "19", runtime: "automatic" }]
        ]
      }
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    dedupe: ["react", "react-dom"],
  },
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["wouter"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select", "lucide-react"],
          utils: ["clsx", "tailwind-merge", "date-fns"],
        }
      }
    },
    // Production source maps multiplied the already large multi-route bundle
    // beyond the memory available to the deployment builder. Keep debugging
    // source maps in local development rather than making deploys fragile.
    sourcemap: false,
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "/api/legal": {
        target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
    fs: {
      allow: [__dirname, path.resolve(__dirname, "../../node_modules")],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "wouter", "@radix-ui/react-dialog",
      "@radix-ui/react-select", "lucide-react", "clsx", "tailwind-merge", "date-fns"]
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/modules/**/*.ts"],
      exclude: ["src/lib/modules/**/index.ts"],
    },
    alias: { "@": path.resolve(__dirname, "src") },
  },
});