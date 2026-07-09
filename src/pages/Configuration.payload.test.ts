import { buildBusinessProfilePayload } from "./Configuration.payload";

// Regression test for the Asana ticket "Step 3 ... Error para finalizar":
// NumberInput already stores exchange_rate in raw format (period decimal,
// see NumberInput.tsx:45-48). Re-applying a LATAM->raw conversion here
// strips the decimal point and corrupts the value sent to the backend.
describe("buildBusinessProfilePayload (Configuration Step 3 exchange rate)", () => {
  const baseValues = {
    business_id: "mi-negocio",
    categories: [{ id: 1 }],
    city: [{ id: 5 }],
    primary_currency: [{ id: 10 }],
  };

  it("keeps the decimal point for a rate with decimals", () => {
    const payload = buildBusinessProfilePayload({
      ...baseValues,
      enable_exchange_rate: true,
      secondary_currency: [{ id: 20 }],
      exchange_rate: "667.05",
    });
    expect(payload.exchange_rate).toBe("667.05");
  });

  it("sends null for exchange_rate and secondary_currency when disabled", () => {
    const payload = buildBusinessProfilePayload({
      ...baseValues,
      enable_exchange_rate: false,
      secondary_currency: [],
      exchange_rate: "",
    });
    expect(payload.exchange_rate).toBeNull();
    expect(payload.secondary_currency).toBeNull();
  });
});
