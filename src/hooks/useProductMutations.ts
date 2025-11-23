import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";
import { createProduct, updateProduct } from "../services/productService";
import { Product } from "../types/product";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useApiMutation<Product, Error, FormData>({
    mutationFn: createProduct,
    successMessage: "Producto creado exitosamente",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useApiMutation<Product, Error, { id: number; product: FormData }>({
    mutationFn: ({ id, product }) => updateProduct(id, product),
    successMessage: "Producto actualizado exitosamente",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
    },
  });
};
