import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renderiza com as variáveis validadas", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Atlus" })).toBeInTheDocument();
    expect(screen.getByTestId("ambiente")).toHaveTextContent("test");
    expect(screen.getByText("http://localhost:3000")).toBeInTheDocument();
  });
});
