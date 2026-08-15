import { formatRelativeTime } from "./relativeTime";

describe("formatRelativeTime", () => {
  it("formats a few minutes ago in Spanish", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe("hace 5 minutos");
  });

  it("formats a future time", () => {
    const inTenMinutes = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    expect(formatRelativeTime(inTenMinutes)).toBe("dentro de 10 minutos");
  });
});
