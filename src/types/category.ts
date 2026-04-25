export interface Category {
  id: string | number;
  label?: string;
  name?: string;
  icon?: string;
  /** Optional order to make the type permissive for different sources */
  order?: number;
  /** Optional code (used in some lists) */
  code?: string;
  //
  hasOffer?: boolean | null;
  discountPercentage?: number | null;
  multibuyOption?: string;
  promotionStartsAt?: string; // ISO 8601, e.g. "2025-05-01T10:00:00Z"
  promotionEndsAt?: string; // ISO 8601
}
