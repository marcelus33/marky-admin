import { render, screen } from "@testing-library/react";
import AppErrorBoundary from "./AppErrorBoundary";

const ProblemChild = () => {
  throw new Error("boom");
};

describe("AppErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders children when there is no error", () => {
    render(
      <AppErrorBoundary>
        <div>contenido normal</div>
      </AppErrorBoundary>
    );

    expect(screen.getByText("contenido normal")).toBeInTheDocument();
  });

  it("renders a fallback UI when a child throws", () => {
    render(
      <AppErrorBoundary>
        <ProblemChild />
      </AppErrorBoundary>
    );

    expect(
      screen.getByText("Ocurrió un error inesperado")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reintentar" })
    ).toBeInTheDocument();
  });
});
