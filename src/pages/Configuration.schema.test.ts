import * as Yup from "yup";
import { validateBusinessName } from "../services/businessService";

jest.mock("../services/businessService", () => ({
  validateBusinessName: jest.fn(),
}));

const mockedValidateBusinessName = validateBusinessName as jest.Mock;

// Mirrors the business_id rule at Configuration.tsx:96-119
const businessIdSchema = Yup.string()
  .required("Este campo es obligatorio")
  .matches(
    /^[a-z0-9\-_]+$/,
    "Solo se permiten letras minúsculas, guiones (-) y guiones bajos (_)",
  )
  .min(4, "No puede tener menos de 4 caracteres")
  .max(24, "No puede tener más de 24 caracteres")
  .test(
    "unique-business-id",
    "Este nombre de negocio ya existe",
    async function (value) {
      if (!value) return true;
      const result = await validateBusinessName(value);
      return !result.is_taken;
    },
  );

describe("business_id validation (Configuration Step 1)", () => {
  beforeEach(() => {
    mockedValidateBusinessName.mockResolvedValue({ is_taken: false });
  });

  it("accepts a 23-character sanitized value (screenshot-2 regression)", async () => {
    const value = "comercio-gastronomico-2"; // 23 chars
    await expect(businessIdSchema.isValid(value)).resolves.toBe(true);
  });

  it("accepts a value at the new 24-character boundary", async () => {
    const value = "a".repeat(24);
    await expect(businessIdSchema.isValid(value)).resolves.toBe(true);
  });

  it("rejects a value over 24 characters", async () => {
    const value = "a".repeat(25);
    await expect(businessIdSchema.isValid(value)).resolves.toBe(false);
  });

  it("rejects values under 4 characters", async () => {
    await expect(businessIdSchema.isValid("abc")).resolves.toBe(false);
  });
});
