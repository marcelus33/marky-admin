import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  updateProductCategoryAvailability,
  ProductCategory,
} from "../services/productService";
import { PaginatedProductCategoriesResponse } from "../services/types";

const useUpdateProductCategoryAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_available }: { id: number; is_available: boolean }) =>
      updateProductCategoryAvailability(id, { is_available }),
    onMutate: async ({
      id,
      is_available,
    }: {
      id: number;
      is_available: boolean;
    }) => {
      const listQueryKey = ["productCategoriesWithProducts"];
      const simpleQueryKey = ["productCategories", { include_products: false }];

      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      await queryClient.cancelQueries({ queryKey: simpleQueryKey });

      // Snapshot previous data
      const previousListQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: listQueryKey })
        .map((q) => ({ queryKey: q.queryKey, previousData: q.state.data }));

      const previousSimple = queryClient.getQueryData(simpleQueryKey);

      // Optimistically update all productCategoriesWithProducts cached queries
      previousListQueries.forEach((snap) => {
        const current = snap.previousData as any;
        if (!current) return;
        const newData = {
          ...current,
          results: (current.results || []).map((cat: any) =>
            cat.id === id ? { ...cat, is_available } : cat,
          ),
        };
        queryClient.setQueryData(snap.queryKey, newData);
      });

      // Optimistically update simple categories list if present
      if (previousSimple) {
        queryClient.setQueryData(simpleQueryKey, (old: any) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((cat: any) =>
              cat.id === id ? { ...cat, is_available } : cat,
            ),
          };
        });
      }

      return { previousListQueries, previousSimple };
    },
    onError: (err, variables, context: any) => {
      // rollback caches from snapshot
      if (context?.previousListQueries) {
        context.previousListQueries.forEach((snap: any) => {
          queryClient.setQueryData(snap.queryKey, snap.previousData);
        });
      }
      if (context?.previousSimple) {
        const simpleQueryKey = [
          "productCategories",
          { include_products: false },
        ];
        queryClient.setQueryData(simpleQueryKey, context.previousSimple);
      }
    },
    onSuccess: (updatedCategory: ProductCategory) => {
      // Optionally show success toast
      toast.success("Disponibilidad de categoría actualizada");
      // Update productCategories list without products
      const categoriesKey = ["productCategories", { include_products: false }];
      queryClient.setQueryData<any>(categoriesKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((category: any) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        };
      });

      // Update categories with products
      // Update categories with products (queryKey includes params as second element in hook)
      queryClient.setQueryData<PaginatedProductCategoriesResponse<any>>(
        ["productCategoriesWithProducts", undefined],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((cat: any) =>
              cat.id === updatedCategory.id
                ? { ...cat, is_available: updatedCategory.is_available }
                : cat,
            ),
          } as PaginatedProductCategoriesResponse<any>;
        },
      );
    },
    onSettled: () => {
      // ensure queries are fresh
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
      queryClient.invalidateQueries({ queryKey: ["productCategories"] });
    },
  });
};

export default useUpdateProductCategoryAvailability;
