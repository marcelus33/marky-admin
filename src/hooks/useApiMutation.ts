import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ShowNotification } from "../utils/utils";

interface UseApiMutationOptions<TData, TError, TVariables>
  extends Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "onSuccess" | "onError"
  > {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessNotification?: boolean;
  showErrorNotification?: boolean;
}

export const useApiMutation = <
  TData = unknown,
  TError = any,
  TVariables = void
>({
  onSuccess,
  onError,
  successMessage = "Operación completada exitosamente",
  errorMessage,
  showSuccessNotification = true,
  showErrorNotification = true,
  ...mutationOptions
}: UseApiMutationOptions<TData, TError, TVariables>) => {
  return useMutation({
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      if (showSuccessNotification) {
        ShowNotification({
          message: successMessage,
          type: "success",
        });
      }
      onSuccess?.(data, variables);
    },
    onError: (error: any, variables, context) => {
      if (showErrorNotification) {
        const message = errorMessage || error.message || "Ha ocurrido un error";
        ShowNotification({
          message,
          type: "error",
        });
      }
      onError?.(error, variables);
    },
  });
};
