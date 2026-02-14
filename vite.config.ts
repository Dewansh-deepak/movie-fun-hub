import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["reelspay-logo.jpg", "favicon.ico"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: { cacheName: "supabase-api", expiration: { maxEntries: 50, maxAgeSeconds: 300 } },
          },
        ],
      },
      manifest: {
        name: "ReelsPay - Create Shorts, Earn Real ₹",
        short_name: "ReelsPay",
        description: "India's AI-powered creator platform. Upload short videos, go viral, and earn real money via UPI.",
        theme_color: "#8B5CF6",
        background_color: "#0A0A0F",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/feed",
        categories: ["entertainment", "social"],
        icons: [
          { src: "/reelspay-logo.jpg", sizes: "192x192", type: "image/jpeg", purpose: "any" },
          { src: "/reelspay-logo.jpg", sizes: "512x512", type: "image/jpeg", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
