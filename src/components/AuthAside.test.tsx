import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import lightTheme from "../themes/light";
import AuthAside from "./AuthAside";

describe("AuthAside", () => {
  it("renders the title, highlighted phrase, and support text", () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <AuthAside
          title="Ya tienes el talento."
          highlight="Ahora muéstralo."
          supportText="Organiza y presenta tus productos en un catálogo digital profesional."
          image={<svg data-testid="mock-image" />}
        />
      </ThemeProvider>,
    );
    expect(
      screen.getByText("Ya tienes el talento.", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ahora muéstralo.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Organiza y presenta tus productos en un catálogo digital profesional.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-image")).toBeInTheDocument();
  });

  it("colors the highlighted phrase with the theme primary color", () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <AuthAside
          title="Una plataforma creada con amor"
          highlight="para tus comensales."
          supportText="No sólo de sabor se trata, sorprende a tu audiencia."
          image={<svg data-testid="mock-image-2" />}
        />
      </ThemeProvider>,
    );
    const highlight = screen.getByText("para tus comensales.");
    expect(getComputedStyle(highlight).color).toBe("rgb(37, 99, 235)"); // #2563EB
  });
});
