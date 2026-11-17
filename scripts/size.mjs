// Mede o bundle inicial (o que o navegador baixa antes de renderizar o hub) a partir do
// manifest do Vite: o chunk de entrada, os imports estáticos dele e o CSS, em gzip.
// Imports dinâmicos (lazy) ficam de fora. Limite do Plano rev. 3, M0: 250 KB gzip.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const LIMITE_KB = Number(process.env.SIZE_LIMIT_KB ?? 250);
const dist = "dist";

let manifest;
try {
  manifest = JSON.parse(readFileSync(join(dist, ".vite", "manifest.json"), "utf8"));
} catch {
  console.error("dist/.vite/manifest.json não encontrado. Rode `pnpm build` antes.");
  process.exit(1);
}

const entrada = Object.values(manifest).find((c) => c.isEntry);
if (!entrada) {
  console.error("Nenhum chunk de entrada no manifest.");
  process.exit(1);
}

const arquivos = new Set();
const visitar = (chave) => {
  const chunk = manifest[chave];
  if (!chunk || arquivos.has(chunk.file)) return;
  arquivos.add(chunk.file);
  for (const css of chunk.css ?? []) arquivos.add(css);
  for (const imp of chunk.imports ?? []) visitar(imp);
};
visitar(Object.keys(manifest).find((k) => manifest[k] === entrada));

let total = 0;
for (const arquivo of arquivos) {
  const kb = gzipSync(readFileSync(join(dist, arquivo)), { level: 9 }).length / 1024;
  total += kb;
  console.log(`${kb.toFixed(1).padStart(8)} KB  ${arquivo}`);
}
console.log(`${total.toFixed(1).padStart(8)} KB  total inicial (gzip), limite ${LIMITE_KB} KB`);

if (total > LIMITE_KB) {
  console.error(`Bundle inicial acima do limite: ${total.toFixed(1)} KB > ${LIMITE_KB} KB.`);
  process.exit(1);
}
