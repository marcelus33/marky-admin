import React from "react";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  usePromotionCountdown,
  PromotionCountdownInput,
  __resetPromotionInvalidationCoalescingForTests,
} from "./usePromotionCountdown";

// Plain .ts (not .tsx) file: use React.createElement instead of JSX, since
// this project's Babel/TS config only enables JSX parsing for .tsx files.
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const renderCountdown = (input: PromotionCountdownInput) =>
  renderHook(() => usePromotionCountdown(input), { wrapper });

// Renders with a custom QueryClient so callers can spy on its methods.
const renderCountdownWithClient = (
  input: PromotionCountdownInput,
  queryClient: QueryClient,
) => {
  const customWrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return renderHook(() => usePromotionCountdown(input), {
    wrapper: customWrapper,
  });
};

// Threads props through renderHook's initialProps/rerender so a test can
// simulate a prop update after mount (e.g. `status` flipping once a
// boundary-crossing invalidation's resulting refetch resolves), rather than
// only ever rendering with a fixed input for the hook's lifetime.
const renderCountdownRerenderable = (initialProps: PromotionCountdownInput) =>
  renderHook(
    (props: PromotionCountdownInput) => usePromotionCountdown(props),
    { wrapper, initialProps },
  );

describe("usePromotionCountdown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // The invalidation call is coalesced across hook instances via a
    // module-level timestamp (see usePromotionCountdown.ts). Reset it so
    // each test's invalidation assertions are independent of real wall-clock
    // proximity to the previous test's invalidation.
    __resetPromotionInvalidationCoalescingForTests();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns null when status is expired", () => {
    const endsAt = new Date(Date.now() - 1000).toISOString();
    const { result } = renderCountdown({ status: "expired", endsAt });
    expect(result.current).toBeNull();
  });

  it("returns null when status is inactive", () => {
    const { result } = renderCountdown({ status: "inactive", endsAt: null });
    expect(result.current).toBeNull();
  });

  it("returns null when status is missing", () => {
    const { result } = renderCountdown({});
    expect(result.current).toBeNull();
  });

  it("shows 'Inicia en 3 días' when scheduled ~3 days out", () => {
    const startsAt = new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const { result } = renderCountdown({ status: "scheduled", startsAt });

    expect(result.current).not.toBeNull();
    expect(result.current?.phase).toBe("starts");
    expect(result.current?.label).toMatch(/^Inicia en 3 días$/);
  });

  it("shows 'Inicia en 2 h' when scheduled ~2 hours out", () => {
    const startsAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const { result } = renderCountdown({ status: "scheduled", startsAt });

    expect(result.current).not.toBeNull();
    expect(result.current?.phase).toBe("starts");
    expect(result.current?.label).toMatch(/^Inicia en 2 h$/);
  });

  it("shows 'Inicia en 30 min.' when scheduled ~30 min out", () => {
    const startsAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const { result } = renderCountdown({ status: "scheduled", startsAt });

    expect(result.current).not.toBeNull();
    expect(result.current?.phase).toBe("starts");
    expect(result.current?.label).toMatch(/^Inicia en 30 min\.$/);
  });

  it("counts down to endsAt when status is active, spanning all 4 units", () => {
    const endsAt = new Date(
      Date.now() + 3 * 86400000 + 8 * 3600000 + 42 * 60000 + 17000,
    ).toISOString();
    const { result } = renderCountdown({ status: "active", endsAt });

    expect(result.current).not.toBeNull();
    expect(result.current?.phase).toBe("ends");
    // Exact literal, not just shape: jest.useFakeTimers() makes `now` fully
    // deterministic here, so this also catches unit-order/off-by-one bugs
    // (e.g. hours computed as total-hours instead of hours-within-the-day)
    // that a shape-only regex like /^\d{2}:\d{2}:\d{2}:\d{2}$/ would miss.
    expect(result.current?.label).toBe("03:08:42:17");
  });

  it("returns null when active but endsAt is missing", () => {
    const { result } = renderCountdown({ status: "active", endsAt: null });
    expect(result.current).toBeNull();
  });

  it("returns null immediately when active but endsAt is already in the past", () => {
    const endsAt = new Date(Date.now() - 1000).toISOString();
    const { result } = renderCountdown({ status: "active", endsAt });
    expect(result.current).toBeNull();
  });

  it("ticks: the seconds value decreases by 1 after 1000ms", () => {
    const endsAt = new Date(Date.now() + 60 * 1000).toISOString();
    const { result } = renderCountdown({ status: "active", endsAt });

    const firstLabel = result.current?.label;
    expect(firstLabel).toMatch(/^\d{2}:\d{2}:\d{2}:\d{2}$/);
    const firstSeconds = Number(firstLabel?.slice(-2));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const secondLabel = result.current?.label;
    const secondSeconds = Number(secondLabel?.slice(-2));

    expect(secondSeconds).toBe((firstSeconds - 1 + 60) % 60);
  });

  it("invalidates productCategoriesWithProducts exactly once when the active countdown crosses zero", () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const endsAt = new Date(Date.now() + 2000).toISOString();

    renderCountdownWithClient({ status: "active", endsAt }, queryClient);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["productCategoriesWithProducts"],
    });
  });

  it("invalidates productCategoriesWithProducts exactly once when the scheduled countdown crosses into active", () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const startsAt = new Date(Date.now() + 2000).toISOString();

    renderCountdownWithClient(
      { status: "scheduled", startsAt },
      queryClient,
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["productCategoriesWithProducts"],
    });
  });

  it("returns null the moment a mounted scheduled promo's start time passes (live boundary crossing, not just already-past-at-mount)", () => {
    const startsAt = new Date(Date.now() + 2000).toISOString();
    const { result } = renderCountdown({ status: "scheduled", startsAt });

    expect(result.current?.phase).toBe("starts");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current).toBeNull();
  });

  it("transitions from 'starts' through null to 'ends' when a scheduled promo flips to active (status prop updates after the resulting refetch)", () => {
    // This is the actual user-visible scheduled -> active journey: the
    // boundary crossing fires an invalidation, the refetch resolves with
    // the backend's new promotion_status, and only THEN does the `status`
    // prop passed into the hook change to "active".
    const startsAt = new Date(Date.now() + 2000).toISOString();
    const endsAt = new Date(Date.now() + 100000).toISOString();

    const { result, rerender } = renderCountdownRerenderable({
      status: "scheduled",
      startsAt,
      endsAt,
    });

    expect(result.current?.phase).toBe("starts");

    // Cross the start boundary while `status` is still "scheduled" (the
    // in-flight window before the refetch has resolved) — must render null,
    // never a live "ends" countdown or a stale "starts" text.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current).toBeNull();

    // Simulate the refetch resolving: the backend now reports "active".
    rerender({ status: "active", startsAt, endsAt });

    expect(result.current).not.toBeNull();
    expect(result.current?.phase).toBe("ends");
  });

  it("coalesces near-simultaneous boundary crossings from different hook instances into a single invalidateQueries call", () => {
    // Simulates every product card in an expiring category, plus the
    // category's own header badge, all sharing the same endsAt and crossing
    // zero on the same 1-second tick.
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const endsAt = new Date(Date.now() + 2000).toISOString();

    renderCountdownWithClient({ status: "active", endsAt }, queryClient);
    renderCountdownWithClient({ status: "active", endsAt }, queryClient);
    renderCountdownWithClient({ status: "active", endsAt }, queryClient);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["productCategoriesWithProducts"],
    });
  });
});
