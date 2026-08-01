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
  it("renders exactly two 'Inicia sesión' login links (desktop header + mobile footer)", () => {
    renderRegister();
    expect(screen.getAllByText("Inicia sesión")).toHaveLength(2);
    expect(screen.getAllByText("¿Ya tienes una cuenta?")).toHaveLength(2);
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
      screen.getByPlaceholderText("Crea una contraseña"),
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
    expect(screen.getByText("Términos de servicio")).toBeInTheDocument();
    expect(screen.getByText("Política de privacidad")).toBeInTheDocument();
  });
});
