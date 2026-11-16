import { parseEnv } from "./env.schema";

describe("parseEnv", () => {
  it("aceita a URL da API e remove a barra final", () => {
    expect(parseEnv({ VITE_API_URL: "https://api.atlus.app/" })).toEqual({
      VITE_API_URL: "https://api.atlus.app",
      VITE_APP_ENV: "development",
    });
  });

  it("falha sem VITE_API_URL e nomeia a variável", () => {
    expect(() => parseEnv({})).toThrow("VITE_API_URL");
  });

  it("trata valor vazio como ausente", () => {
    expect(() => parseEnv({ VITE_API_URL: "" })).toThrow("VITE_API_URL");
  });

  it("rejeita ambiente desconhecido", () => {
    expect(() => parseEnv({ VITE_API_URL: "http://localhost:3000", VITE_APP_ENV: "qa" })).toThrow(
      "VITE_APP_ENV",
    );
  });
});
