import { useQuery } from "@tanstack/react-query";
import {
  getAttributes,
  AttributesApiResponse,
} from "../services/attributesService";

export const useAttributes = (enabled: boolean) => {
  return useQuery<AttributesApiResponse>({
    queryKey: ["attributes"],
    queryFn: getAttributes,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled,
  });
};
