import { useQuery } from "@tanstack/react-query";
import { getCities, City } from "../services/citiesService";
import { PaginatedResponse } from "../services/types";

export const useCities = (countryId: string | null) => {
  const { data, isLoading, isError } = useQuery<PaginatedResponse<City>>({
    queryKey: ["cities", countryId],
    queryFn: () => getCities({ country_id: countryId }),
    enabled: !!countryId,
  });

  const cities = data?.results;

  return { cities, isLoading, isError };
};
