import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProductCategory,
  ProductCategoryPayload,
} from "../services/productService";
import { PaginatedResponse } from "../services/types";
import { ProductCategory } from "../services/productService";

const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number;
      category: ProductCategoryPayload;
    }) => updateProductCategory(id, category),
    onSuccess: (updatedCategory) => {
      const queryKey = ["productCategories", { include_products: false }];
      queryClient.setQueryData<PaginatedResponse<ProductCategory>>(
        queryKey,
        (old) => {
          if (!old) {
            return {
              count: 0,
              next: null,
              previous: null,
              results: [],
            };
          }
          return {
            ...old,
            results: old.results.map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category
            ),
          };
        }
      );
    },
  });
};

export default useUpdateProductCategory;
