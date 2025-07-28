export interface ProductGridItem {
  id: string | number;
  name: string;
  image?: string;
  views: number;
  price: string | number;
  priceAlt?: string | number;
  isRecommended?: boolean;
  isFavorite?: boolean;
  discountPercent?: number;
}
