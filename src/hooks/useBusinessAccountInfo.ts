import { useQuery } from "@tanstack/react-query";
import {
  getBusinessAccountInfo,
  BusinessAccountInfo,
} from "../services/businessService";

export const useBusinessAccountInfo = () => {
  return useQuery<BusinessAccountInfo>({
    queryKey: ["businessAccountInfo"],
    queryFn: getBusinessAccountInfo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
