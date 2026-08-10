import { AxiosProgressEvent } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";
import { createProduct, updateProduct } from "../services/productService";
import { Product } from "../types/product";

interface CreateProductVariables {
  formData: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useApiMutation<Product, Error, CreateProductVariables>({
    mutationFn: ({ formData, onUploadProgress }) =>
      createProduct(formData, onUploadProgress),
    successMessage: "Producto creado exitosamente",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
    },
  });
};

interface UpdateProductVariables {
  id: number;
  product: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useApiMutation<Product, Error, UpdateProductVariables>({
    mutationFn: ({ id, product, onUploadProgress }) =>
      updateProduct(id, product, onUploadProgress),
    successMessage: "Producto actualizado exitosamente",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
    },
  });
};

// Lightweight hook to update only product availability. Uses the same
// updateProduct endpoint but surfaces a concise success message.
export const useUpdateProductAvailability = () => {
  const queryClient = useQueryClient();
  return useApiMutation<Product, Error, { id: number; product: FormData }>({
    mutationFn: ({ id, product }) => updateProduct(id, product),
    successMessage: "Disponibilidad actualizada",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
    },
  });
};
