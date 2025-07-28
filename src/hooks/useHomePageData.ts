import { useQuery } from "@tanstack/react-query";
import { getHomePageData, HomePageData } from "../services/businessService";

export const useHomePageData = () => {
  return useQuery<HomePageData>({
    queryKey: ["homePageData"],
    queryFn: getHomePageData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
