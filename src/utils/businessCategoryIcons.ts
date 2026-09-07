import categoryIcons from "../assets/icons/category/categoryIcons";

// Categorías sembradas en el backend (business/management/commands/seed.py)
// mapeadas a los íconos disponibles en src/assets/icons/category.
// "Restaurante" no tiene ícono dedicado; se usa "cocina" como más cercano.
export const BUSINESS_CATEGORY_ICON_MAP: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  Restaurante: categoryIcons.cocina,
  Pizzería: categoryIcons.pizza,
  Cafetería: categoryIcons.cafe,
  Heladería: categoryIcons.helado,
  "Parrillada / Asados": categoryIcons.asado,
  Panadería: categoryIcons.bagette,
  Pastelería: categoryIcons.torta,
};

export default BUSINESS_CATEGORY_ICON_MAP;
