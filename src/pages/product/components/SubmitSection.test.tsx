import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import lightTheme from "../../../themes/light";
import SubmitSection from "./SubmitSection";

const renderSubmitSection = (
  props: Partial<React.ComponentProps<typeof SubmitSection>> = {},
) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={lightTheme}>
        <SubmitSection onPublish={() => {}} {...props} />
      </ThemeProvider>
    </MemoryRouter>,
  );

const getMainButton = () =>
  screen.getByRole("button", { name: /Publicar|Publicando|Subiendo|Publicado|Guardar cambios/ });

describe("SubmitSection", () => {
  it("stays enabled and labeled Publicar in create mode, even with no changes", () => {
    renderSubmitSection({ isEditMode: false, isDirty: false });

    const button = getMainButton();
    expect(button).toHaveTextContent("Publicar");
    expect(button).not.toBeDisabled();
  });

  it("is disabled and labeled Publicado in edit mode with no pending changes", () => {
    renderSubmitSection({ isEditMode: true, isDirty: false });

    const button = getMainButton();
    expect(button).toHaveTextContent("Publicado");
    expect(button).toBeDisabled();
  });

  it("is enabled and labeled Guardar cambios in edit mode once there are pending changes", () => {
    renderSubmitSection({ isEditMode: true, isDirty: true });

    const button = getMainButton();
    expect(button).toHaveTextContent("Guardar cambios");
    expect(button).not.toBeDisabled();
  });

  it("is disabled and shows Publicando... while submitting, regardless of dirty state", () => {
    renderSubmitSection({ isEditMode: true, isDirty: false, isSubmitting: true });

    const button = getMainButton();
    expect(button).toHaveTextContent("Publicando...");
    expect(button).toBeDisabled();
  });

  it("shows upload progress while submitting with an in-flight upload", () => {
    renderSubmitSection({
      isEditMode: true,
      isDirty: true,
      isSubmitting: true,
      uploadProgress: 42,
    });

    const button = getMainButton();
    expect(button).toHaveTextContent("Subiendo... 42%");
    expect(button).toBeDisabled();
  });
});
