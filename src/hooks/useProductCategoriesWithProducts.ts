import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getProductCategoriesWithProducts } from "../services/productService";
import { PaginatedProductCategoriesResponse } from "../services/types";
import { CategoryWithProducts } from "../types/categoryWithProducts";

const useProductCategoriesWithProducts = (
  params?: any,
  options?: Omit<
    UseQueryOptions<PaginatedProductCategoriesResponse<CategoryWithProducts>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["productCategoriesWithProducts", params],
    queryFn: () => getProductCategoriesWithProducts(params),
    staleTime: Infinity,
    ...options,
  });
};

export default useProductCategoriesWithProducts;
