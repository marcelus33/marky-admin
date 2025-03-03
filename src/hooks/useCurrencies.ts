import { useQuery } from "@tanstack/react-query";
import { Currency, getCurrencies } from "../services/currenciesService";

export const useCurrencies = (params: any = {}) => {
  const {
    data: currenciesResponse = {},
    isLoading,
    isError,
  } = useQuery<Currency[]>({
    queryKey: ["currencies"],
    queryFn: () => getCurrencies(params),
  });

  // @ts-ignore
  const currencies = currenciesResponse.results;

  return {
    currencies,
    isLoading,
    isError,
  };
};
