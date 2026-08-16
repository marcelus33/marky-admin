import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import lightTheme from "../themes/light";
import CheckboxWithLabel from "./CheckboxWithLabel";

const setupCheckbox = (checked: boolean, handleChange = jest.fn()) => {
  render(
    <ThemeProvider theme={lightTheme}>
      <CheckboxWithLabel
        label="Mantener la sesión iniciada"
        name="rememberMe"
        checked={checked}
        onChange={handleChange}
      />
    </ThemeProvider>,
  );
  return handleChange;
};

describe("CheckboxWithLabel sizing (login page polish ticket)", () => {
  it("renders a 22x22 icon with the spec border when unchecked", () => {
    setupCheckbox(false);
    const icon = screen.getByTestId("checkbox-icon-unchecked");
    const style = getComputedStyle(icon);
    expect(style.width).toBe("22px");
    expect(style.height).toBe("22px");
    // Check longhand border properties individually — jsdom doesn't reliably
    // compute the `border` shorthand from an injected stylesheet.
    expect(style.borderWidth).toBe("1px");
    expect(style.borderStyle).toBe("solid");
    // jsdom keeps a shorthand `border`'s color in its original hex form
    // rather than normalizing to rgb() the way it does for standalone
    // border-color declarations.
    expect(style.borderColor).toBe("#aeb7c4"); // #AEB7C4
  });

  it("renders a filled primary-colored icon when checked", () => {
    setupCheckbox(true);
    const icon = screen.getByTestId("checkbox-icon-checked");
    const style = getComputedStyle(icon);
    expect(style.width).toBe("22px");
    expect(style.height).toBe("22px");
    expect(style.backgroundColor).toBe("rgb(37, 99, 235)"); // #2563EB
  });

  it("still fires onChange when clicked", () => {
    const handleChange = setupCheckbox(false);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
