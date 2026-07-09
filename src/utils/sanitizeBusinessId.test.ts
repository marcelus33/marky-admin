import { sanitizeBusinessId } from "./sanitizeBusinessId";

describe("sanitizeBusinessId", () => {
  it("lowercases uppercase letters", () => {
    expect(sanitizeBusinessId("MiComercio")).toBe("micomercio");
  });

  it("replaces spaces with hyphens", () => {
    expect(sanitizeBusinessId("comercio gastronomico 23")).toBe(
      "comercio-gastronomico-23",
    );
  });

  it("strips accented vowels and ñ", () => {
    expect(sanitizeBusinessId("comercio-gastronómico-23")).toBe(
      "comercio-gastronomico-23",
    );
    expect(sanitizeBusinessId("cañón-áéíóú")).toBe("canon-aeiou");
  });

  it("drops characters outside a-z0-9-_", () => {
    expect(sanitizeBusinessId("café's @panadería!")).toBe(
      "cafes-panaderia",
    );
  });

  it("leaves an already-valid value untouched", () => {
    expect(sanitizeBusinessId("comercio-gastronomico_23")).toBe(
      "comercio-gastronomico_23",
    );
  });

  it("handles combined uppercase + accents + spaces + symbols in one pass", () => {
    expect(sanitizeBusinessId("La Pastelería Dulce Momento!")).toBe(
      "la-pasteleria-dulce-momento",
    );
  });

  it("returns an empty string for empty input", () => {
    expect(sanitizeBusinessId("")).toBe("");
  });
});
