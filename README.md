# frontAtlus · Web do Atlus

Web do hub público de festas, eventos e produtos de Cuiabá e da gestão das atléticas.
React 19, Vite 8, React Router 7, React Query 5 e Tailwind CSS 4.

O que construir e quando está no **Plano de Implementação rev. 3**; como construir, no
**Guia de Implementação das Macros**. Este repositório está na **M0 · Fundação técnica**:
só o ambiente (tooling, variáveis, testes e CI). As telas chegam a partir da M1.

## Rodando local em 5 passos

Pré-requisitos: Node 22 e pnpm 10 (`mise install` ou `corepack enable`). Para falar com a
API, suba o [backAtlus](https://github.com/Atlus-Trojan/backAtlus) com `docker compose up`.

```bash
git clone https://github.com/Atlus-Trojan/frontAtlus.git && cd frontAtlus   # 1. clonar
pnpm install                                                                 # 2. dependências
cp .env.example .env.local                                                   # 3. variáveis
pnpm dev                                                                     # 4. http://localhost:5173
pnpm test && pnpm lint                                                       # 5. conferir
```

## Variáveis

| Variável       | Uso                                                           |
| -------------- | ------------------------------------------------------------- |
| `VITE_API_URL` | URL da API, sem barra no fim. Local: `http://localhost:3000`. |
| `VITE_APP_ENV` | `development`, `test`, `staging` ou `production`.             |

São validadas em `src/env.schema.ts` no dev server, no build e em runtime: faltando uma,
nada sobe e a mensagem diz qual. Tudo que começa com `VITE_` fica público no bundle, então
nunca coloque segredo aqui.

## Scripts

| Comando                                           | O que faz                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                                        | Dev server com HMR na porta 5173                                                                        |
| `pnpm build` · `pnpm preview`                     | Build de produção e servidor local dele (porta 4173)                                                    |
| `pnpm lint` · `pnpm format` · `pnpm format:check` | oxlint e oxfmt                                                                                          |
| `pnpm typecheck`                                  | TypeScript estrito                                                                                      |
| `pnpm test`                                       | Vitest + Testing Library (jsdom)                                                                        |
| `pnpm test:e2e`                                   | Playwright contra o build (`pnpm build` antes; `pnpm exec playwright install chromium` na primeira vez) |
| `pnpm size`                                       | Falha se o bundle inicial passar de 250 KB gzip (critério da M0)                                        |

## Estrutura

```
src/
  env.schema.ts  validação das variáveis (usada também pelo vite.config.ts)
  env.ts         variáveis validadas para o app
  lib/           query-client.ts (React Query, sem retry em 4xx)
  test/          setup do Vitest
  App.tsx        página provisória da M0
e2e/             testes Playwright (360 px e desktop)
scripts/size.mjs medição do bundle inicial
```

As macros seguintes acrescentam `api/` (cliente HTTP com refresh), `auth/`
(AuthProvider), `routes.tsx` e guards, `layouts/`, `components/` e `views/`, como descrito
no Guia (1.7 e capítulo M0). A gestão (`/app/*`) entra com `lazy()`, para não pesar no
bundle de quem só compra.

## CI

`.github/workflows/ci.yml` roda em todo PR e na `main`. O primeiro job faz lint, format,
tipos, testes, build e tamanho do bundle. O segundo roda o e2e no Playwright sobre o mesmo build.

## Staging (Render)

`render.yaml` é o Blueprint de um Static Site com fallback de SPA, cache longo em
`/assets/*` e headers de segurança. O deploy só acontece com o CI verde.

Primeira configuração (uma vez):

1. No Render, **New → Blueprint** apontando para este repositório.
2. Em `atlus-web`, preencha `VITE_API_URL` com a URL da API (ex.: `https://api.<domínio>`).
3. Em **Settings → Custom Domains**, adicione `app.<domínio>`, no mesmo domínio da API, para o cookie de refresh ser first-party.
4. Na API, `APP_URL` precisa ser exatamente essa origem (CORS com credenciais).
5. No GitHub, proteja a `main` exigindo os checks do CI e 1 aprovação.
