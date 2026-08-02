import { render, screen, fireEvent } from "@testing-library/react";
import { Formik, Form, Field } from "formik";
import NumberInput from "./NumberInput";

const renderField = () =>
  render(
    <Formik initialValues={{ rate: "" }} onSubmit={() => {}}>
      <Form>
        <Field component={NumberInput} name="rate" label="Tasa de cambio" />
      </Form>
    </Formik>,
  );

describe("NumberInput decimal limit (Configuration Step 3 exchange rate)", () => {
  it("truncates typed input to 2 decimal digits", () => {
    renderField();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "667,05678" } });
    expect(input).toHaveValue("667,05");
  });

  it("keeps a value with exactly 2 decimals untouched", () => {
    renderField();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1,50" } });
    expect(input).toHaveValue("1,50");
  });
});
