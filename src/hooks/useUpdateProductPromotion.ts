import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../services/productService";
import { objectToFormData } from "../utils/formData";
import { mapProductGridItem } from "../mappers/productMapper";
import { PaginatedProductCategoriesResponse } from "../services/types";
import { ShowNotification } from "../utils/utils";

type PromotionPayload = {
  discount_percentage: string;
  multibuy_option?: string | null;
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
};

const useUpdateProductPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    any,
    { id: number; promotion: PromotionPayload },
    unknown
  >({
    mutationFn: async (variables: {
      id: number;
      promotion: PromotionPayload;
    }) => {
      const { id, promotion } = variables;
      const fd = objectToFormData(promotion as any);
      return updateProduct(id, fd as any);
    },
    onMutate: async (vars: { id: number; promotion: PromotionPayload }) => {
      const { id, promotion } = vars;
      const listQueryKey = ["productCategoriesWithProducts"];

      // cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: listQueryKey });

      // snapshot current queries
      const snapshots = queryClient
        .getQueryCache()
        .findAll({ queryKey: listQueryKey })
        .map((q) => ({ queryKey: q.queryKey, previousData: q.state.data }));

      // apply optimistic update to each cached query
      snapshots.forEach((snap) => {
        const current = snap.previousData as any;
        if (!current) return;

        const newData = {
          ...current,
          results: (current.results || []).map((cat: any) => ({
            ...cat,
            products: (cat.products || []).map((p: any) => {
              if (Number(p.id) !== Number(id)) return p;

              // patch only promotion-related fields
              return {
                ...p,
                discountPercent:
                  promotion.discount_percentage !== undefined &&
                  promotion.discount_percentage !== null
                    ? Number(promotion.discount_percentage)
                    : 0,
                multibuyOption: promotion.multibuy_option ?? null,
                promotionStartsAt: promotion.promotion_starts_at ?? null,
                promotionEndsAt: promotion.promotion_ends_at ?? null,
              };
            }),
          })),
        };

        queryClient.setQueryData(snap.queryKey, newData);
      });

      return { snapshots };
    },
    onError: (
      error: any,
      variables: { id: number; promotion: PromotionPayload } | undefined,
      context: any,
    ) => {
      // rollback
      if (context?.snapshots) {
        context.snapshots.forEach((snap: any) => {
          queryClient.setQueryData(snap.queryKey, snap.previousData);
        });
      }
      ShowNotification({
        message: "Error al guardar la promoción",
        type: "error",
      });
    },
    onSuccess: (updatedProduct: any) => {
      ShowNotification({
        message: "Promoción del producto guardada exitosamente",
        type: "success",
      });

      // Map to product grid item format
      const mapped = mapProductGridItem(updatedProduct);

      // Find all cached queries for productCategoriesWithProducts and update the product in-place
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["productCategoriesWithProducts"] });

      queries.forEach((q) => {
        const current = q.state.data as
          | PaginatedProductCategoriesResponse<any>
          | undefined;
        if (!current) return;

        const newData: PaginatedProductCategoriesResponse<any> = {
          ...current,
          results: current.results.map((cat: any) => ({
            ...cat,
            products: (cat.products || []).map((p: any) =>
              Number(p.id) === Number(updatedProduct.id)
                ? { ...p, ...mapped }
                : p,
            ),
          })),
        };

        queryClient.setQueryData(q.queryKey, newData);
      });
    },
  });
};

export default useUpdateProductPromotion;
