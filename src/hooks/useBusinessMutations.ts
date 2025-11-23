import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";
import { updateProfileImage, HomePageData } from "../services/businessService";

export const useUpdateBusinessProfileImage = () => {
  const queryClient = useQueryClient();
  return useApiMutation<{ profile_image: string }, Error, FormData>({
    mutationFn: updateProfileImage,
    successMessage: "Imagen de perfil actualizada exitosamente",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homePageData"],
      });
    },
  });
};
