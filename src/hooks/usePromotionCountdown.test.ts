import React from "react";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  usePromotionCountdown,
  PromotionCountdownInput,
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

describe("usePromotionCountdown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
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
    expect(result.current?.label).toMatch(/^\d{2}:\d{2}:\d{2}:\d{2}$/);
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
});
