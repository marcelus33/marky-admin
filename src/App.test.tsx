import { formatPrice } from "./utils/format";
import { splitISODateTime } from "./utils/utils";

describe("formatPrice", () => {
  it("formats integer prices with two decimal places", () => {
    expect(formatPrice(10)).toBe("10,00");
  });

  it("formats string prices", () => {
    expect(formatPrice("1234.5")).toBe("1.234,50");
  });

  it("adds thousands separator", () => {
    expect(formatPrice(1000000)).toBe("1.000.000,00");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("0,00");
  });

  it("formats negative prices", () => {
    expect(formatPrice(-1000)).toBe("-1.000,00");
  });

  it("documents the current (broken) output for non-numeric strings", () => {
    // formatPrice("abc") -> parseFloat("abc") is NaN -> "NaN".toFixed-ish path
    // produces "NaN,undefined". This is a known display bug, tracked in
    // AUDIT-FOLLOWUP-2026-06-14.md rather than fixed here.
    expect(formatPrice("abc")).toBe("NaN,undefined");
  });
});

describe("splitISODateTime", () => {
  it("returns empty strings when no value provided", () => {
    expect(splitISODateTime()).toEqual({ date: "", time: "" });
    expect(splitISODateTime(undefined)).toEqual({ date: "", time: "" });
  });

  it("splits ISO string into date and HH:mm time", () => {
    const result = splitISODateTime("2024-06-15T14:30:00Z");
    expect(result.date).toBe("2024-06-15");
    expect(result.time).toBe("14:30");
  });
});
