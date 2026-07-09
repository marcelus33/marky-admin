import * as Yup from "yup";

const isRequiredMessage = "Este campo es requerido";

// Mirrors the businessName rule at Register.tsx:48-50
const businessNameSchema = Yup.string()
  .max(15, "No puede tener más de 15 caracteres")
  .required(isRequiredMessage);

describe("businessName validation (Register)", () => {
  it("accepts a value at the 15-character boundary", async () => {
    const value = "a".repeat(15);
    await expect(businessNameSchema.isValid(value)).resolves.toBe(true);
  });

  it("rejects a value over 15 characters", async () => {
    const value = "a".repeat(16);
    await expect(businessNameSchema.isValid(value)).resolves.toBe(false);
  });

  it("rejects an empty value", async () => {
    await expect(businessNameSchema.isValid("")).resolves.toBe(false);
  });
});
