import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({mode}) => ({
  plugins: [
    react(),
    mode === "analyze" &&
    visualizer({
      filename: "reports/bundle-stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ].filter(Boolean),
  server: {
    host: true,
  },
  build: {
    reportCompressedSize: true,
  },
}));
