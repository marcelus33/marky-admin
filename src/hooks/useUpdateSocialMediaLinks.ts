import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";
import {
  updateSocialMediaLinks,
  SocialMediaLinksReplacePayload,
  SocialMediaLinksReplaceResponse,
} from "../services/businessService";

export const useUpdateSocialMediaLinks = () => {
  const queryClient = useQueryClient();

  return useApiMutation<SocialMediaLinksReplaceResponse, any, SocialMediaLinksReplacePayload>({
    mutationFn: updateSocialMediaLinks,
    successMessage: "Canales guardados exitosamente",
    onSuccess: () => {
      // El backend reemplaza el set completo de canales en cada guardado, así
      // que se invalida (y no se reconstruye a mano) para reflejar el estado
      // real del servidor.
      queryClient.invalidateQueries({ queryKey: ["homePageData"] });
    },
  });
};
