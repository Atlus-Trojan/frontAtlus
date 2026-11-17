import { env } from "./env";

/**
 * Página provisória da M0: só prova que build, deploy e variáveis funcionam. As rotas,
 * layouts e telas chegam a partir da M1.
 */
export default function App() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-3 px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Atlus</h1>
      <p className="text-base text-neutral-600">
        Festas, eventos e produtos das atléticas de Cuiabá.
      </p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-neutral-500">
        <dt>Ambiente</dt>
        <dd data-testid="ambiente">{env.VITE_APP_ENV}</dd>
        <dt>API</dt>
        <dd className="break-all">{env.VITE_API_URL}</dd>
      </dl>
    </main>
  );
}
