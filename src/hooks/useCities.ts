import { useQuery } from "@tanstack/react-query";
import { getCities, City } from "../services/citiesService";

// Hook para obtener ciudades de un país
export const useCities = (countryId: string | null) => {
  const {
    data: citiesResponse = {},
    isLoading,
    isError,
  } = useQuery<City[]>({
    queryKey: ["cities", countryId], // queryKey depende del countryId
    queryFn: () => getCities({ country_id: countryId }), // Pasamos el countryId a la función de obtener ciudades
    enabled: !!countryId, // Solo hace la llamada si hay un countryId
  });

  // @ts-ignore
  const cities = citiesResponse.results;

  return {
    cities,
    isLoading,
    isError,
  };
};
