import { useQuery } from "@tanstack/react-query";
import { getCountries, Country } from "../services/citiesService";

// Hook para obtener países
export const useCountries = () => {
  const {
    data: countriesResponse = {},
    isLoading,
    isError,
  } = useQuery<Country[]>({
    queryKey: ["countries"], // queryKey debe ser parte de las opciones
    queryFn: getCountries, // Aquí es donde pasas la función que hace la llamada a la API
  });

  // @ts-ignore
  const countries = countriesResponse.results;

  return {
    countries,
    isLoading,
    isError,
  };
};
