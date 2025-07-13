import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd());
  // const BASE_URL = env.VITE_DEV_BACKEND_API;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    optimizeDeps: {
      include: ["@magic-sdk/admin"],
    },
    server: {
      proxy: {
        "/api": {
          target: "https://taskparser.onrender.com",
          changeOrigin: true, 
        },
      },
    },
  };
});
