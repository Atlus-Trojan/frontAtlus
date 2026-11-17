import { z } from "zod";

/**
 * Variáveis do web. Só as que começam com VITE_ chegam ao navegador, e todas viram
 * texto público no bundle: nunca coloque segredo aqui.
 */
export const envSchema = z.object({
  /** URL da API, sem barra no fim. Em staging e produção: https://api.<domínio>. */
  VITE_API_URL: z.url().transform((u) => u.replace(/\/+$/, "")),
  VITE_APP_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, unknown>): Env {
  const limpo = Object.fromEntries(Object.entries(source).filter(([, v]) => v !== ""));
  const result = envSchema.safeParse(limpo);
  if (result.success) return result.data;

  const detalhes = result.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Variáveis de ambiente do web inválidas ou ausentes:\n${detalhes}`);
}
