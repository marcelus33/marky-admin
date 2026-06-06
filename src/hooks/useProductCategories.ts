import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getProductCategories,
  ProductCategory,
} from "../services/productService";
import { PaginatedResponse } from "../services/types";

const useProductCategories = (
  params?: any,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<ProductCategory>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["productCategories", params],
    queryFn: () => getProductCategories(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export default useProductCategories;
