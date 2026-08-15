import { usePromotionCountdown } from "./usePromotionCountdown";

describe("usePromotionCountdown", () => {
  it("returns null when status is expired", () => {
    const endsAt = new Date(Date.now() - 1000).toISOString();
    expect(usePromotionCountdown({ status: "expired", endsAt })).toBeNull();
  });

  it("returns null when status is inactive", () => {
    expect(
      usePromotionCountdown({ status: "inactive", endsAt: null }),
    ).toBeNull();
  });

  it("returns null when status is missing", () => {
    expect(usePromotionCountdown({})).toBeNull();
  });

  it("returns null when status is scheduled, even with endsAt present", () => {
    // A promotion that hasn't reached promotion_start_at yet must not render
    // a countdown at all — it would be indistinguishable from a live one.
    const endsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    expect(
      usePromotionCountdown({ status: "scheduled", endsAt }),
    ).toBeNull();
  });

  it("counts down to endsAt when status is active", () => {
    const endsAt = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(); // ~1 day 1 hour out
    const result = usePromotionCountdown({
      status: "active",
      endsAt,
    });

    expect(result).not.toBeNull();
    expect(result?.label).toMatch(/^1 día : \d+ horas? : \d+ min$/);
  });

  it("returns null when active but endsAt is missing", () => {
    expect(usePromotionCountdown({ status: "active", endsAt: null })).toBeNull();
  });

  it("formats a sub-minute remainder as '0 min' rather than negative/garbled text", () => {
    const endsAt = new Date(Date.now() - 1).toISOString();
    // status active with an already-past endsAt is an edge case the backend
    // shouldn't produce, but the formatter must not blow up on it.
    const result = usePromotionCountdown({
      status: "active",
      endsAt,
    });
    expect(result?.label).toBe("0 min");
  });
});
