import { useQuery } from "@tanstack/react-query";
import { Currency, getCurrencies } from "../services/currenciesService";
import { PaginatedResponse } from "../services/types";

export const useCurrencies = (params: any = {}) => {
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Currency>>({
    queryKey: ["currencies"],
    queryFn: () => getCurrencies(params),
  });

  const currencies = data?.results;

  return { currencies, isLoading, isError };
};
