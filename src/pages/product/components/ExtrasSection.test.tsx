import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { Formik } from "formik";
import lightTheme from "../../../themes/light";
import ExtrasSection from "./ExtrasSection";

// useBusinessAccountInfo transitively imports axiosConfig -> axios, whose
// installed version ships ESM-only and breaks CRA's default Jest transform.
// Mock it out, same as ProductCard.test.tsx / ProductPromotionModal.test.tsx
// do for productService.
jest.mock("../../../hooks/useBusinessAccountInfo", () => ({
  useBusinessAccountInfo: () => ({ data: { primary_currency_code: "PYG" } }),
}));

interface Addon {
  id?: number;
  name: string;
  price: number | string;
  _delete?: boolean;
}

const renderSection = (addons: Addon[]) =>
  render(
    <ThemeProvider theme={lightTheme}>
      <Formik initialValues={{ addons }} onSubmit={() => {}}>
        {(formikProps) => (
          <>
            <ExtrasSection
              {...formikProps}
              showExtras
              onShowExtrasChange={() => {}}
            />
            <pre data-testid="addons-debug">
              {JSON.stringify(formikProps.values.addons)}
            </pre>
          </>
        )}
      </Formik>
    </ThemeProvider>,
  );

const readAddons = (): Addon[] =>
  JSON.parse(screen.getByTestId("addons-debug").textContent || "[]");

describe("ExtrasSection", () => {
  it("adds a new row without an id, so the backend creates it instead of treating it as an update to an existing row", () => {
    renderSection([]);

    fireEvent.click(screen.getByText("Añadir otro extra"));

    const addons = readAddons();
    expect(addons).toHaveLength(1);
    expect(addons[0]).not.toHaveProperty("id");
  });

  it("soft-deletes a persisted row (flags _delete, keeps it in the array) instead of splicing it out, and hides it from view", () => {
    renderSection([
      { id: 10, name: "Queso extra", price: 2 },
      { id: 11, name: "Tocino", price: 3 },
    ]);

    expect(screen.getAllByTestId("DeleteIcon")).toHaveLength(2);

    const [firstDelete] = screen.getAllByTestId("DeleteIcon");
    fireEvent.click(firstDelete);

    const addons = readAddons();
    expect(addons).toHaveLength(2);
    expect(addons[0]).toMatchObject({ id: 10, _delete: true });
    expect(addons[1]).toMatchObject({ id: 11 });
    expect(addons[1]._delete).toBeFalsy();

    // the deleted row is no longer rendered
    expect(screen.getAllByTestId("DeleteIcon")).toHaveLength(1);
    expect(screen.queryByDisplayValue("Queso extra")).not.toBeInTheDocument();
  });

  it("removes a never-saved row (no id) outright instead of tombstoning it", () => {
    renderSection([{ name: "Nuevo extra", price: "" }]);

    fireEvent.click(screen.getAllByTestId("DeleteIcon")[0]);

    expect(readAddons()).toHaveLength(0);
  });
});
