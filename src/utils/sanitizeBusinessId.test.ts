import { sanitizeBusinessId, sanitizeBusinessIdLive } from "./sanitizeBusinessId";

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

  it("collapses duplicate hyphens produced by dropped symbols", () => {
    expect(sanitizeBusinessId("Café & Postres")).toBe("cafe-postres");
    expect(sanitizeBusinessId("marky--pasteleria")).toBe("marky-pasteleria");
  });

  it("trims leading and trailing hyphens", () => {
    expect(sanitizeBusinessId(" marky ")).toBe("marky");
    expect(sanitizeBusinessId("-marky-")).toBe("marky");
  });

  it("handles the ticket's example transformations", () => {
    expect(sanitizeBusinessId("Marky Pastelería")).toBe("marky-pasteleria");
    expect(sanitizeBusinessId("Dulce Momento")).toBe("dulce-momento");
    expect(sanitizeBusinessId("La Ñata Bakery")).toBe("la-nata-bakery");
    expect(sanitizeBusinessId("Pastelería 2026")).toBe("pasteleria-2026");
  });
});

describe("sanitizeBusinessIdLive", () => {
  // Simulates a controlled input: each keystroke re-sanitizes
  // (previously sanitized value + newly typed char).
  const simulateTyping = (text: string): string => {
    let value = "";
    for (const ch of text) {
      value = sanitizeBusinessIdLive(value + ch);
    }
    return value;
  };

  it("does not trim edge hyphens (a mid-typing trailing hyphen is a valid word separator)", () => {
    expect(sanitizeBusinessIdLive("cafe-")).toBe("cafe-");
    expect(sanitizeBusinessIdLive("-cafe")).toBe("-cafe");
  });

  it("keeps the word separator alive across a live keystroke-by-keystroke session", () => {
    // Regression test: sanitizeBusinessId (with edge-trim) applied on every
    // keystroke of a controlled input used to eat the hyphen produced by a
    // space before the next word arrived, e.g. "Café & Postres" collapsed to
    // "cafepostres" instead of "cafe-postres".
    expect(simulateTyping("Café & Postres")).toBe("cafe-postres");
    expect(simulateTyping("Marky Pastelería")).toBe("marky-pasteleria");
  });

  it("still collapses duplicate hyphens live", () => {
    expect(simulateTyping("marky   pasteleria")).toBe("marky-pasteleria");
  });
});
