import { PromotionStatus } from "../types/product";

export interface PromotionCountdownInput {
  status?: PromotionStatus;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface PromotionCountdown {
  /** "scheduled" = promo hasn't started yet ("empieza en"); "active" = counting down to the end ("finaliza en"). */
  phase: "scheduled" | "active";
  /** e.g. "10 días : 11 horas : 30 min" */
  label: string;
}

// Example: "10 días : 11 horas : 30 min"
const formatRemainingDetailed = (ms: number): string => {
  if (ms <= 0) return "0 min";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const daysPart = `${days} ${days === 1 ? "día" : "días"}`;
  const hoursPart = `${hours} ${hours === 1 ? "hora" : "horas"}`;
  const minutesPart = `${minutes} min`;

  return `${daysPart} : ${hoursPart} : ${minutesPart}`;
};

/**
 * Derives the countdown to show (if any) from the backend's resolved
 * `promotion_status` (products/promotions.py) rather than re-deriving
 * "now >= end" locally — this is what keeps the card, category header, and
 * quick modal in agreement instead of each computing it independently
 * (Asana ticket #8). Returns null for expired/inactive/missing status, so
 * callers render nothing rather than a stale or contradictory badge.
 */
export const usePromotionCountdown = ({
  status,
  startsAt,
  endsAt,
}: PromotionCountdownInput): PromotionCountdown | null => {
  if (status !== "active" && status !== "scheduled") return null;

  const now = new Date();

  if (status === "scheduled" && startsAt) {
    const diff = new Date(startsAt).getTime() - now.getTime();
    return { phase: "scheduled", label: formatRemainingDetailed(diff) };
  }

  if (status === "active" && endsAt) {
    const diff = new Date(endsAt).getTime() - now.getTime();
    return { phase: "active", label: formatRemainingDetailed(diff) };
  }

  return null;
};
