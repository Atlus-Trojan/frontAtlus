import { QueryClient } from "@tanstack/react-query";

/** Status HTTP do erro, quando houver. O cliente de API (M1) lança erros com `status`. */
function statusDe(erro: unknown): number | undefined {
  if (typeof erro === "object" && erro !== null && "status" in erro) {
    const status = (erro as { status: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

/** Erro 4xx é resposta definitiva da API: repetir não muda nada. Rede e 5xx tentam de novo. */
export function deveRepetir(tentativas: number, erro: unknown): boolean {
  const status = statusDe(erro);
  if (status !== undefined && status >= 400 && status < 500) return false;
  return tentativas < 2;
}

export function criarQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: deveRepetir, staleTime: 30_000, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });
}
