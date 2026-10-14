import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {
        /**
         * Split the libraries out of the app bundle.
         *
         * This does not make the download smaller - the same bytes still
         * arrive on a first visit. What it buys is caching: React, Supabase
         * and the router change only when they are upgraded, so editing a
         * page no longer invalidates 500 kB of vendor code for every
         * returning customer. On mobile data that is the difference worth
         * having.
         *
         * Routes are already split by React.lazy in src/App.jsx; this is the
         * part of the bundle that lazy loading cannot reach, because the
         * navbar needs auth and the shell needs the router on first paint.
         */
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("@tanstack")) return "vendor-query";
          if (id.includes("react-router")) return "vendor-router";
          // Matched last: "react-router" and "react-hook-form" also contain
          // "react", so the narrower rules above have to win first.
          if (id.includes("react-dom") || id.includes("node_modules/react/")) {
            return "vendor-react";
          }

          return undefined;
        },
      },
    },
  },
});
