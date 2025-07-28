import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPromotionToProductCategory } from "../services/productService";
import { PaginatedResponse } from "../services/types";
import { ProductCategory } from "../services/productService";

const useAddPromotionToProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      promotion,
    }: {
      id: number;
      promotion: {
        has_offer: boolean;
        discount_percentage: string;
        multibuy_option?: string;
        promotion_starts_at: string;
        promotion_ends_at: string;
      };
    }) => addPromotionToProductCategory(id, promotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] });
    },
  });
};

export default useAddPromotionToProductCategory;
