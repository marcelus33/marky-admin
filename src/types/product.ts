export type MediaType = "image" | "video";

export interface MediaItemLocal {
  id?: number; // present for existing media
  file: File | string; // File when new, string URL when existing
  originalFile?: string; // optional backup of remote URL
  name?: string;
  media_type: MediaType;
  product?: number;
  _delete?: boolean; // mark for deletion
  // order?: number | null;
}

export interface ProductGridItem {
  id: string | number;
  name: string;
  /** Optional short description used in product cards */
  description?: string;
  image?: string;
  views?: number;
  price: string | number;
  priceAlt?: string | number;
  /** Fully formatted primary price coming from the backend (e.g. "PYG 80.000,00") */
  primaryPrice?: string;
  /** Fully formatted secondary price coming from the backend (e.g. "USD 10,53") */
  secondaryPrice?: string;
  /** Fully formatted primary price with an active discount applied (e.g. "PYG 60.000,00") */
  primaryPriceWithDiscount?: string;
  /** Fully formatted secondary price with an active discount applied (e.g. "USD 7,89") */
  secondaryPriceWithDiscount?: string;
  isRecommended?: boolean;
  isFavorite?: boolean;
  discountPercent?: number;

  // mapped from backend `multibuy_option`
  multibuyOption?: string | null;
  // mapped promotion dates (from productMapper)
  promotionStartsAt?: string | null;
  promotionEndsAt?: string | null;
  // availability fields forwarded from backend mapper
  is_available?: boolean;
  is_active?: boolean;
}

export interface ProductVariant {
  id?: number;
  name: string;
  description?: string;
  price: number;
  //
  image?: File | string; // same pattern: File when new, URL when existing
  primaryPrice?: string;
  secondaryPrice?: string;
  _delete?: boolean;
}

export interface ProductAddon {
  id?: number;
  name: string;
  price: number;
  _delete?: boolean;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: { id: number; name: string } | null;
  // New field to represent availability separate from legacy `is_active`.
  // This field may be provided by the API as `is_available` in some cases.
  is_available?: boolean;
  is_active: boolean;
  variants: ProductVariant[];
  addons: ProductAddon[];
  stopper?: "FAVORITE" | "RECOMMENDED" | "";
  isPromotionActive?: boolean;
  promotionOption?: "descuento" | "oferta" | "";
  discountPercentage?: number;
  multibuyOption?: "2x1" | "3x2" | "";
  countdownActive?: boolean;
  promotionStartDate?: string;
  promotionStartTime?: string;
  promotionEndDate?: string;
  promotionEndTime?: string;
  media?: MediaItemLocal[];
  primaryPrice?: string;
  secondaryPrice?: string;
  /** Fully formatted primary price with discount coming from the backend (e.g. "PYG 60.000,00") */
  primaryPriceWithDiscount?: string;
  /** Fully formatted secondary price with discount coming from the backend (e.g. "USD 7,89") */
  secondaryPriceWithDiscount?: string;
  // media?: {
  //   id: number;
  //   file: string;
  //   originalFile?: string;
  //   name?: string;
  //   media_type: "image" | "video";
  //   product: number;
  // }[];
}
