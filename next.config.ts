import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  compiler: {
    // Must match relay.config.json
    relay: {
      src: "./",
      artifactDirectory: "./__generated__",
      language: "typescript",
      eagerEsModules: true,
    },
  },
  images: {
    remotePatterns: [new URL("https://rickandmortyapi.com/api/character/avatar/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
