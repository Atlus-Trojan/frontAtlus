import { deveRepetir } from "./query-client";

describe("deveRepetir", () => {
  it("não repete 4xx", () => {
    expect(deveRepetir(0, { status: 400 })).toBe(false);
    expect(deveRepetir(0, { status: 404 })).toBe(false);
    expect(deveRepetir(0, { status: 409 })).toBe(false);
  });

  it("repete falha de rede e 5xx até duas vezes", () => {
    expect(deveRepetir(0, new TypeError("Failed to fetch"))).toBe(true);
    expect(deveRepetir(1, { status: 503 })).toBe(true);
    expect(deveRepetir(2, { status: 503 })).toBe(false);
  });
});
