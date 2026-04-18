import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/productService";
import { Product } from "../types/product";

export const useProductDetail = (id?: number) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (typeof id === "undefined") throw new Error("No id provided");
      return getProductById(id);
    },
    enabled: typeof id !== "undefined",
    retry: 1,
  });
};

export default useProductDetail;
