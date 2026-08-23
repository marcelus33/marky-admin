import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import lightTheme from "../themes/light";
import Link from "./Link";

const renderLink = (variant?: "primary" | "secondary" | "accent") =>
  render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <Link to="/register" variant={variant}>
          Regístrate
        </Link>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe("Link accent variant (login page 'Regístrate' link)", () => {
  it("renders the accent variant in the primary blue with bold weight", () => {
    renderLink("accent");
    const link = screen.getByText("Regístrate");
    const style = getComputedStyle(link);
    expect(style.color).toBe("rgb(37, 99, 235)"); // #2563EB
    expect(style.fontWeight).toBe("700");
    expect(style.cursor).toBe("pointer");
  });

  it("leaves the default primary variant's font weight unchanged", () => {
    // The default ("primary") variant resolves to fontWeight 300/400 depending
    // on the variant ternary — it must NOT pick up accent's bold 700, since
    // other call sites (e.g. "¿Olvidaste tu contraseña?") rely on the default.
    renderLink();
    const link = screen.getByText("Regístrate");
    const style = getComputedStyle(link);
    expect(style.fontWeight).not.toBe("700");
  });
});
