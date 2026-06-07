import { useQuery } from "@tanstack/react-query";
import { getCountries, Country } from "../services/citiesService";
import { PaginatedResponse } from "../services/types";

export const useCountries = () => {
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Country>>({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const countries = data?.results;

  return { countries, isLoading, isError };
};
