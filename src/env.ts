import { parseEnv } from "./env.schema";

/** Variáveis já validadas. O build valida antes (vite.config.ts); aqui é a garantia em runtime. */
export const env = parseEnv(import.meta.env);
