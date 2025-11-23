export interface Category {
  id: string | number;
  label?: string;
  name?: string;
  icon?: string;
  order: number;
  //
  hasOffer?: boolean | null;
  discountPercentage?: number | null;
  multibuyOption?: string;
  promotionStartsAt?: string; // ISO 8601, e.g. "2025-05-01T10:00:00Z"
  promotionEndsAt?: string; // ISO 8601
}
