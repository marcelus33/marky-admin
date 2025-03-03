import { useQuery } from "@tanstack/react-query";
import { Category, getCategories } from "../services/categoriesService";

export const useCategories = (params: any = {}) => {
  const {
    data: categoriesResponse = {},
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getCategories(params),
  });

  // @ts-ignore
  const categories = categoriesResponse.results;

  return {
    categories,
    isLoading,
    isError,
  };
};
