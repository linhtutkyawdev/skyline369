import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      "/api/index.php/v1": {
        target: "https://staging.slotegrator.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "placeholder.svg"], // Add other static assets if needed
      manifest: {
        name: "Skyline369 App",
        short_name: "Skyline369",
        description: "My Awesome Skyline369 App description",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "192.png", // Or path to a 192x192 icon
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "512.png", // Or path to a 512x512 icon
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "/www/wwwroot/skyline/public/dist", // Change this to your desired folder
    emptyOutDir: true,
  },
}));
