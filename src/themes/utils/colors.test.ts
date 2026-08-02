import colors from "./colors";

describe("light theme palette (login page polish ticket)", () => {
  it("uses the updated brand blue as primary.main", () => {
    expect(colors.light.primary.main).toBe("#2563EB");
  });

  it("keeps the existing hover/dark blue", () => {
    expect(colors.light.primary.dark).toBe("#2962CB");
  });

  it("uses the updated body text color", () => {
    expect(colors.light.text.primary).toBe("#374151");
  });

  it("uses the updated placeholder/secondary text color", () => {
    expect(colors.light.text.disabled).toBe("#6B7280");
  });

  it("uses the updated input border color", () => {
    expect(colors.light.grey[800]).toBe("#AEB7C4");
  });

  it("uses white input backgrounds", () => {
    expect(colors.light.grey[100]).toBe("#FFFFFF");
  });
});
