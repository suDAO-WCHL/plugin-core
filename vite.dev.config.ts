import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  plugins: [
    react(),
  ],
  server: {
    host: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
      {
        find: "@sudao-wchl/plugin-core",
        replacement: path.resolve(__dirname, "./lib"),
      },
    ],
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    dedupe: ["@dfinity/agent"],
  },
})
