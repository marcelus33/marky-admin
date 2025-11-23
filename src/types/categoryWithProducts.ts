import { ProductGridItem } from "./product";

export interface CategoryWithProducts {
  id: number;
  name: string;
  icon: string;
  multibuy_option: string | null;
  discount_percentage: string;
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
  products: ProductGridItem[];
}
