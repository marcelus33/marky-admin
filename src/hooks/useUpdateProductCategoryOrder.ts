import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductCategoryOrder } from "../services/productService";

const useUpdateProductCategoryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductCategoryOrder,
  });
};

export default useUpdateProductCategoryOrder;
