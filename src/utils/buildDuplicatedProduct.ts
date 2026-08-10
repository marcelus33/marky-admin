import { Product } from "../types/product";

// Builds a "duplicated" copy of a product to prefill the create form: strips
// the id, appends " (copia)" to the name, drops media (URL/file complications),
// and strips variant/addon ids so they're created fresh. Shared by the
// duplicate flow on the product edit form and the Product Grid card menu.
export const buildDuplicatedProduct = (product: Product): Product => {
  const values = product as any;
  const duplicated: Product = {
    ...values,
    id: undefined as any,
    name: `${values.name} (copia)`,
    media: [],
    variants: (values.variants || []).map((v: any) => ({
      name: v.name,
      description: v.description,
      price: Number(v.price) || 0,
      image: undefined,
    })),
    addons: (values.addons || []).map((a: any) => ({
      name: a.name,
      price: Number(a.price) || 0,
    })),
  };

  if (duplicated.category && typeof duplicated.category === "object") {
    duplicated.category = (duplicated.category as any).id;
  }

  return duplicated;
};
