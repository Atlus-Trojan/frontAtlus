import { expect, test } from "@playwright/test";

test("a página carrega sem erro de console e sem scroll horizontal", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => m.type() === "error" && erros.push(m.text()));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Atlus" })).toBeVisible();
  await expect(page).toHaveTitle("Atlus");

  const larguras = await page.evaluate(() => ({
    conteudo: document.documentElement.scrollWidth,
    janela: window.innerWidth,
  }));
  expect(larguras.conteudo).toBeLessThanOrEqual(larguras.janela);
  expect(erros).toEqual([]);
});

test("qualquer caminho serve o index (fallback de SPA)", async ({ page }) => {
  const res = await page.goto("/festas/qualquer-coisa");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Atlus" })).toBeVisible();
});
