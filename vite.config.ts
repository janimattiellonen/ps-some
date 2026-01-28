import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import styleX from "unplugin-stylex/vite";

export default defineConfig({
  server: {
    port: 5165,
  },
  plugins: [
    styleX({
      dev: process.env.NODE_ENV === "development",
    }),
    react(),
  ],
});
