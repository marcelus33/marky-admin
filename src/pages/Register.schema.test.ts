import * as Yup from "yup";

const isRequiredMessage = "Este campo es requerido";

// Mirrors the businessName rule at Register.tsx:49-51
const businessNameSchema = Yup.string()
  .max(22, "No puede tener más de 22 caracteres")
  .required(isRequiredMessage);

describe("businessName validation (Register)", () => {
  it("accepts a value at the 22-character boundary", async () => {
    const value = "a".repeat(22);
    await expect(businessNameSchema.isValid(value)).resolves.toBe(true);
  });

  it("rejects a value over 22 characters", async () => {
    const value = "a".repeat(23);
    await expect(businessNameSchema.isValid(value)).resolves.toBe(false);
  });

  it("rejects an empty value", async () => {
    await expect(businessNameSchema.isValid("")).resolves.toBe(false);
  });
});
