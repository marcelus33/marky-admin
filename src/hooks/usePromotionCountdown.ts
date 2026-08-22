import { useEffect, useRef, useState } from "react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { PromotionStatus } from "../types/product";

export interface PromotionCountdownInput {
  status?: PromotionStatus;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface PromotionCountdown {
  /** "ends" = active promo's live countdown to promotion_ends_at.
   *  "starts" = scheduled promo's live countdown to promotion_starts_at. */
  phase: "starts" | "ends";
  /** "ends" phase e.g. "03:08:42:17"; "starts" phase e.g. "Inicia en 3 días" */
  label: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

// "ends" phase — compact, zero-padded, no word labels, e.g. "03:08:42:17"
const formatCountdownCompact = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// "starts" phase — tiered granularity, word-labeled, e.g. "Inicia en 3 días" / "Inicia en 2 h" / "Inicia en 58 min."
const formatStartsIn = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  if (days >= 1) return `Inicia en ${days} ${days === 1 ? "día" : "días"}`;
  const hours = Math.floor(totalSeconds / 3600);
  if (hours >= 1) return `Inicia en ${hours} h`;
  const minutes = Math.max(1, Math.floor(totalSeconds / 60));
  return `Inicia en ${minutes} min.`;
};

// Module-level (not per-hook-instance) coalescing guard: when many cards
// share the same endsAt/startsAt (e.g. every product in an expiring
// category, plus the category's own header badge), they all cross zero on
// the same 1-second tick and would otherwise each independently call
// invalidateQueries — React Query does not coalesce these itself, so that's
// one real HTTP request per card. This collapses near-simultaneous
// invalidation attempts from different hook instances into a single actual
// call. The per-instance `firedBoundaryRef` guard (see below) is unrelated
// and still controls whether a given instance even attempts to invalidate.
let lastInvalidatedAt = 0;
const COALESCE_WINDOW_MS = 2000;

function invalidatePromotionsQueryCoalesced(queryClient: QueryClient) {
  const now = Date.now();
  if (now - lastInvalidatedAt > COALESCE_WINDOW_MS) {
    lastInvalidatedAt = now;
    queryClient.invalidateQueries({
      queryKey: ["productCategoriesWithProducts"],
    });
  }
}

// Test-only escape hatch: resets the module-level coalescing guard so tests
// can assert invalidation behavior independently of each other/of real wall
// clock timing. Not used by application code.
export function __resetPromotionInvalidationCoalescingForTests() {
  lastInvalidatedAt = 0;
}

/**
 * Derives the countdown to show (if any) from the backend's resolved
 * `promotion_status` (products/promotions.py) rather than re-deriving
 * "now >= start/end" locally — this is what keeps the card, category header,
 * and quick modal in agreement instead of each computing it independently
 * (Asana ticket #8).
 *
 * Ticks once per second while `status` is `active` or `scheduled`, producing:
 *  - `phase: "ends"` — the live `DD:HH:MM:SS` countdown for an active promo.
 *  - `phase: "starts"` — the "Inicia en X" indicator for a scheduled promo.
 *
 * Returns null for scheduled/expired/inactive/missing status, and also once
 * remaining time for the current phase hits zero — never renders a stale
 * "Inicia en" text or a "00:00:00:00" countdown. When remaining time crosses
 * zero while mounted (a promo's start or end time arrives live), the
 * discounted price and server-derived status won't update on their own, so
 * this fires a single `productCategoriesWithProducts` invalidation per
 * boundary crossing to pick up the new backend-resolved state. Near-
 * simultaneous crossings from other cards sharing the same start/end time
 * are coalesced into a single actual request (see
 * `invalidatePromotionsQueryCoalesced` above).
 */
export const usePromotionCountdown = ({
  status,
  startsAt,
  endsAt,
}: PromotionCountdownInput): PromotionCountdown | null => {
  const [now, setNow] = useState(() => Date.now());
  const queryClient = useQueryClient();
  const firedBoundaryRef = useRef(false);

  useEffect(() => {
    if (status !== "active" && status !== "scheduled") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    firedBoundaryRef.current = false;
  }, [status, startsAt, endsAt]);

  // Boundary-crossing invalidation is a side effect, so it belongs in an
  // effect rather than the render body: firing it during render risks
  // double-firing (or firing from a discarded/interrupted render) under
  // concurrent rendering. The render path below stays pure — it only
  // computes `diff` and returns the derived value.
  useEffect(() => {
    if (status === "active" && endsAt) {
      const diff = new Date(endsAt).getTime() - now;
      if (diff <= 0 && !firedBoundaryRef.current) {
        firedBoundaryRef.current = true;
        invalidatePromotionsQueryCoalesced(queryClient);
      }
    } else if (status === "scheduled" && startsAt) {
      const diff = new Date(startsAt).getTime() - now;
      if (diff <= 0 && !firedBoundaryRef.current) {
        firedBoundaryRef.current = true;
        invalidatePromotionsQueryCoalesced(queryClient);
      }
    }
  }, [now, status, startsAt, endsAt, queryClient]);

  if (status === "active" && endsAt) {
    const diff = new Date(endsAt).getTime() - now;
    if (diff <= 0) return null;
    return { phase: "ends", label: formatCountdownCompact(diff) };
  }

  if (status === "scheduled" && startsAt) {
    const diff = new Date(startsAt).getTime() - now;
    if (diff <= 0) return null;
    return { phase: "starts", label: formatStartsIn(diff) };
  }

  return null;
};
