import { defineConfig, devices } from "@playwright/test";

const PORTA = 4173;

/** e2e contra o build de produção servido pelo `vite preview` (rode `pnpm build` antes). */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORTA}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile-360",
      use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 } },
    },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm preview",
    port: PORTA,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
