import { useMutation } from "@tanstack/react-query";
import { updateProductCategoryOrder } from "../services/productService";

const useUpdateProductCategoryOrder = () => {
  return useMutation({
    mutationFn: updateProductCategoryOrder,
  });
};

export default useUpdateProductCategoryOrder;
