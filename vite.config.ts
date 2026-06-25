import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.MEOO_PROXY_TARGET;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname
      }
    },
    server: {
      host: "0.0.0.0",
      port: 3015,
      strictPort: true,
      allowedHosts: true,
      hmr: false,
      ...(proxyTarget
        ? {
            proxy: {
              "/sb-api": {
                target: proxyTarget,
                changeOrigin: true,
                secure: true,
                headers: { "X-Meoo-Source": "local-dev" }
              }
            }
          }
        : {})
    },
    base: "./",
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      assetsInlineLimit: 1024 * 1024,
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]"
        }
      }
    }
  };
});
