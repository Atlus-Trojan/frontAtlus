import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { parseEnv } from "./src/env.schema.ts";

export default defineConfig(({ mode, command }) => {
  // Falha o dev server e o build se faltar variável, com o nome dela na mensagem.
  if (mode !== "test") parseEnv(loadEnv(mode, process.cwd(), "VITE_"));

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
    build: {
      target: "es2022",
      sourcemap: command === "build" && mode !== "production" ? "hidden" : false,
      // Usado por scripts/size.mjs para medir o bundle inicial.
      manifest: true,
    },
  };
});
