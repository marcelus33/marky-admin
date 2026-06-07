import { useQuery } from "@tanstack/react-query";
import { getCategories, Category } from "../services/categoriesService";
import { PaginatedResponse } from "../services/types";

export const useCategories = (params: any = {}) => {
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Category>>({
    queryKey: ["categories"],
    queryFn: () => getCategories(params),
  });

  const categories = data?.results;

  return { categories, isLoading, isError };
};
