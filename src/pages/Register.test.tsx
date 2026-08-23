import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import lightTheme from "../themes/light";
import Register from "./Register";

jest.mock("../services/authService", () => ({
  register: jest.fn(),
}));

const renderRegister = () =>
  render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </ThemeProvider>,
  );

describe("Register page copy (register page polish ticket)", () => {
  it("renders the desktop header and mobile footer login links with their own copy", () => {
    renderRegister();
    expect(screen.getAllByText("Inicia sesión")).toHaveLength(1);
    expect(screen.getByText("¿Ya tienes una cuenta?")).toBeInTheDocument();
    expect(screen.getByText("Inicia sesión ahora")).toBeInTheDocument();
    expect(screen.getByText("¿Ya formas parte?")).toBeInTheDocument();
  });

  it("renders the updated form title", () => {
    renderRegister();
    expect(screen.getByText("Crea tu cuenta en Marky")).toBeInTheDocument();
  });

  it("renders the updated field placeholders", () => {
    renderRegister();
    expect(
      screen.getByPlaceholderText("Ej. Dulce Momento"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("nombre@correo.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingrese su contraseña"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("981 123 456")).toBeInTheDocument();
  });

  it("renders the updated legal text with two links", () => {
    renderRegister();
    expect(
      screen.getByText("Al crear una cuenta, aceptas nuestros", {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Términos del Servicio")).toBeInTheDocument();
    expect(screen.getByText("Políticas de Privacidad")).toBeInTheDocument();
  });
});
