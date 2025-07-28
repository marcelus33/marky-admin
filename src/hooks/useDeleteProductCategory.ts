import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductCategory } from "../services/productService";
import { PaginatedResponse } from "../services/types";
import { ProductCategory } from "../services/productService";

const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductCategory,
    onMutate: async (id) => {
      const queryKey = ["productCategories", { include_products: false }];
      await queryClient.cancelQueries({ queryKey });

      const previousCategories =
        queryClient.getQueryData<PaginatedResponse<ProductCategory>>(queryKey);

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
            results: old.results.filter((category) => category.id !== id),
          };
        }
      );

      return { previousCategories };
    },
    onError: (err, id, context) => {
      const queryKey = ["productCategories", { include_products: false }];
      if (context?.previousCategories) {
        queryClient.setQueryData(queryKey, context.previousCategories);
      }
    },
  });
};

export default useDeleteProductCategory;
