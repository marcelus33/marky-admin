import { ProductGridItem } from "./product";

export interface CategoryWithProducts {
  id: string | number;
  name: string;
  icon: string; // Usás claves como "asado", "bebidas", etc.
  products: ProductGridItem[];
}
