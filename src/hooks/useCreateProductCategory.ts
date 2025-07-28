import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductCategory } from "../services/productService";
import { PaginatedResponse } from "../services/types";
import { ProductCategory } from "../services/productService";

const useCreateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductCategory,
    onSuccess: (newCategory) => {
      const queryKey = ["productCategories", { include_products: false }];
      queryClient.setQueryData<PaginatedResponse<ProductCategory>>(
        queryKey,
        (old) => {
          if (!old) {
            return {
              count: 1,
              next: null,
              previous: null,
              results: [newCategory],
            };
          }
          return {
            ...old,
            results: [...old.results, newCategory],
          };
        }
      );
    },
  });
};

export default useCreateProductCategory;
