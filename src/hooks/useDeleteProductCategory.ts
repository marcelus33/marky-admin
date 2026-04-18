import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteProductCategory,
  ProductCategory,
} from "../services/productService";
import {
  PaginatedResponse,
  PaginatedProductCategoriesResponse,
} from "../services/types";
import { CategoryWithProducts } from "../types/categoryWithProducts";
import { toast } from "react-toastify";

const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductCategory,
    onMutate: async (id: number) => {
      // 1) Optimistically update the simple categories list (no products)
      const simpleQueryKey = ["productCategories", { include_products: false }];
      await queryClient.cancelQueries({ queryKey: simpleQueryKey });

      const previousCategories =
        queryClient.getQueryData<PaginatedResponse<ProductCategory>>(
          simpleQueryKey,
        );

      queryClient.setQueryData<PaginatedResponse<ProductCategory>>(
        simpleQueryKey,
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
        },
      );

      // 2) Optimistically update all productCategoriesWithProducts queries
      const listQueryKey = ["productCategoriesWithProducts"];
      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: listQueryKey });

      const previousCategoriesWithProducts = queries.map((q) => ({
        queryKey: q.queryKey,
        previousData: q.state.data as
          | PaginatedProductCategoriesResponse<CategoryWithProducts>
          | undefined,
      }));

      queries.forEach((q) => {
        const current = q.state.data as
          | PaginatedProductCategoriesResponse<CategoryWithProducts>
          | undefined;
        if (!current) return;

        let removedProductsCount = 0;

        const newResults = (current.results || []).filter((cat) => {
          if (cat.id === id) {
            removedProductsCount += Array.isArray(cat.products)
              ? cat.products.length
              : 0;
            return false; // remove this category
          }
          return true;
        });

        const newData: PaginatedProductCategoriesResponse<CategoryWithProducts> =
          {
            ...current,
            results: newResults,
            products_count:
              typeof current.products_count === "number"
                ? Math.max(
                    0,
                    (current.products_count || 0) - removedProductsCount,
                  )
                : current.products_count,
          };

        queryClient.setQueryData(q.queryKey, newData);
      });

      return { previousCategories, previousCategoriesWithProducts };
    },
    onError: (_err, _id, context: any) => {
      const simpleQueryKey = ["productCategories", { include_products: false }];
      if (context?.previousCategories) {
        queryClient.setQueryData(simpleQueryKey, context.previousCategories);
      }

      if (context?.previousCategoriesWithProducts) {
        context.previousCategoriesWithProducts.forEach((snap: any) => {
          queryClient.setQueryData(snap.queryKey, snap.previousData);
        });
      }
      toast.error("Error al eliminar la categoría");
    },
    onSuccess: () => {
      toast.success("La categoría fue eliminada con éxito");
    },
  });
};

export default useDeleteProductCategory;
