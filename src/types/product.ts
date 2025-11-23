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
  image?: string;
  views?: number;
  price: string | number;
  priceAlt?: string | number;
  isRecommended?: boolean;
  isFavorite?: boolean;
  discountPercent?: number;
}

export interface ProductVariant {
  id?: number;
  name: string;
  description?: string;
  price: number;
  //
  image?: File | string; // same pattern: File when new, URL when existing
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
  // media?: {
  //   id: number;
  //   file: string;
  //   originalFile?: string;
  //   name?: string;
  //   media_type: "image" | "video";
  //   product: number;
  // }[];
}
