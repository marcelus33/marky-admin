import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../services/productService";
import { objectToFormData } from "../utils/formData";
import { ShowNotification } from "../utils/utils";

type PromotionPayload = {
  discount_percentage: number;
  multibuy_option?: string;
  promotion_starts_at: string;
  promotion_ends_at: string;
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

              // patch only promotion-related fields. "" is the FormData-safe
              // way to clear multibuy_option/dates (see promotionForm.ts) —
              // treat it the same as null here so the optimistic UI matches
              // what the server will actually store.
              return {
                ...p,
                discountPercent:
                  promotion.discount_percentage !== undefined &&
                  promotion.discount_percentage !== null
                    ? Number(promotion.discount_percentage)
                    : 0,
                multibuyOption: promotion.multibuy_option || null,
                promotionStartsAt: promotion.promotion_starts_at || null,
                promotionEndsAt: promotion.promotion_ends_at || null,
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
    onSuccess: () => {
      ShowNotification({
        message: "Promoción del producto guardada exitosamente",
        type: "success",
      });

      // Refetch rather than merge the mutation response into the cache: the
      // update endpoint's response is ProductInputSerializer's shape (no
      // `id`, no `promotion_status`), so a manual merge here can neither
      // key the right product nor carry the derived status the badges need
      // — a refetch gets the real, fully-resolved server state instead.
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
    },
  });
};

export default useUpdateProductPromotion;
