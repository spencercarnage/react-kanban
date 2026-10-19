import babel from "@rolldown/plugin-babel";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    // Compiles `graphql` tagged templates to the generated artifacts, like
    // `compiler.relay` does for Next.
    babel({
      plugins: [
        [
          "relay",
          { artifactDirectory: "./__generated__", eagerEsModules: true },
        ],
      ],
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.polyfills.ts", "./vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/.next/**"],
  },
});
