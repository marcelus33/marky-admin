import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import lightTheme from "../themes/light";
import Login from "./Login";

jest.mock("../services/authService", () => ({
  login: jest.fn(),
}));

const renderLogin = () =>
  render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </ThemeProvider>,
  );

describe("Login page copy (login page polish ticket)", () => {
  it("renders the full form title", () => {
    renderLogin();
    expect(screen.getByText("Inicia sesión en Marky")).toBeInTheDocument();
  });

  it("renders the email and password placeholders", () => {
    renderLogin();
    expect(
      screen.getByPlaceholderText("nombre@correo.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingresa tu contraseña"),
    ).toBeInTheDocument();
  });

  it("renders the updated register prompt", () => {
    renderLogin();
    // El prompt se renderiza dos veces (versión desktop y mobile, alternadas
    // por CSS), de ahí getAllByText en lugar de getByText.
    expect(
      screen.getAllByText("¿No tienes una cuenta?").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Regístrate").length).toBeGreaterThan(0);
  });
});
