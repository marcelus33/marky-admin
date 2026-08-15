import { usePromotionCountdown } from "./usePromotionCountdown";

describe("usePromotionCountdown", () => {
  it("returns null when status is expired", () => {
    const endsAt = new Date(Date.now() - 1000).toISOString();
    expect(
      usePromotionCountdown({ status: "expired", endsAt, startsAt: null }),
    ).toBeNull();
  });

  it("returns null when status is inactive", () => {
    expect(
      usePromotionCountdown({ status: "inactive", endsAt: null, startsAt: null }),
    ).toBeNull();
  });

  it("returns null when status is missing", () => {
    expect(usePromotionCountdown({})).toBeNull();
  });

  it("returns an 'active' phase counting down to endsAt when status is active", () => {
    const endsAt = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(); // ~1 day 1 hour out
    const result = usePromotionCountdown({
      status: "active",
      startsAt: null,
      endsAt,
    });

    expect(result).not.toBeNull();
    expect(result?.phase).toBe("active");
    expect(result?.label).toMatch(/^1 día : \d+ horas? : \d+ min$/);
  });

  it("returns a 'scheduled' phase counting down to startsAt when status is scheduled", () => {
    const startsAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // ~2 hours out
    const result = usePromotionCountdown({
      status: "scheduled",
      startsAt,
      endsAt: null,
    });

    expect(result).not.toBeNull();
    expect(result?.phase).toBe("scheduled");
    expect(result?.label).toMatch(/^0 días : \d+ horas? : \d+ min$/);
  });

  it("returns null when active but endsAt is missing", () => {
    expect(
      usePromotionCountdown({ status: "active", startsAt: null, endsAt: null }),
    ).toBeNull();
  });

  it("formats a sub-minute remainder as '0 min' rather than negative/garbled text", () => {
    const endsAt = new Date(Date.now() - 1).toISOString();
    // status active with an already-past endsAt is an edge case the backend
    // shouldn't produce, but the formatter must not blow up on it.
    const result = usePromotionCountdown({
      status: "active",
      startsAt: null,
      endsAt,
    });
    expect(result?.label).toBe("0 min");
  });
});
