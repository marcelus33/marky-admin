import { PromotionStatus } from "../types/product";

export interface PromotionCountdownInput {
  status?: PromotionStatus;
  endsAt?: string | null;
}

export interface PromotionCountdown {
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
 * (Asana ticket #8). Only shows a countdown while the promotion is actually
 * `active`: a `scheduled` promotion (now < promotion_starts_at) must not be
 * visually indistinguishable from a live one, so it renders nothing until
 * the backend reports `active`. Returns null for scheduled/expired/inactive/
 * missing status, so callers render nothing rather than a stale or
 * contradictory badge.
 */
export const usePromotionCountdown = ({
  status,
  endsAt,
}: PromotionCountdownInput): PromotionCountdown | null => {
  if (status !== "active" || !endsAt) return null;

  const diff = new Date(endsAt).getTime() - Date.now();
  return { label: formatRemainingDetailed(diff) };
};
