import { AxiosProgressEvent } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";
import { createProduct, updateProduct } from "../services/productService";
import { Product } from "../types/product";
import { ShowNotification } from "../utils/utils";

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

interface MoveProductToCategoryVariables {
  id: number;
  categoryId: number | null;
  categoryName: string;
}

// Moves a product to another category (or to "Sin categoría" when
// categoryId is null) from the product's context menu, without going
// through the full edit form. Builds FormData manually instead of via
// objectToFormData, which silently drops null/undefined keys — here we
// need an explicit empty string so DRF's PrimaryKeyRelatedField(allow_null)
// actually clears the category server-side rather than leaving it untouched.
export const useMoveProductToCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutation<Product, any, MoveProductToCategoryVariables>({
    mutationFn: ({ id, categoryId }) => {
      const formData = new FormData();
      formData.append("category", categoryId === null ? "" : String(categoryId));
      return updateProduct(id, formData);
    },
    showSuccessNotification: false,
    showErrorNotification: false,
    onSuccess: (_data, variables) => {
      ShowNotification({
        message: `Producto movido a "${variables.categoryName}".`,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["productCategoriesWithProducts"],
      });
    },
    onError: (error: any) => {
      // A 400 here is the Favorito-del-mes conflict raised by the backend
      // (already phrased for end users); anything else (network/500) falls
      // back to the ticket's generic copy instead of a raw error message.
      const message =
        error?.status === 400 && error?.message
          ? error.message
          : "No se pudo mover el producto. Intenta nuevamente.";
      ShowNotification({ message, type: "error" });
    },
  });
};
