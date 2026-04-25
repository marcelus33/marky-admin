import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categoriesService";

export const useCategories = (params: any = {}) => {
  const {
    data: categoriesResponse = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(params),
  });

  // The API returns a paginated response; results contains the items
  // We avoid rigid typing here so the returned items can be used in UI lists
  // that expect id/name and optional extra fields.
  // @ts-ignore - keep compatibility with various Category-like shapes
  const categories = categoriesResponse.results;

  return {
    categories,
    isLoading,
    isError,
  };
};
