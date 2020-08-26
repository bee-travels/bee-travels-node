import useSWR from "swr";
import fetcher from "./fetcher";

function useExchangeRates() {
  const { loading, data } = useSWR("/api/v1/currency/rates", fetcher);

  let rates = { USD: 1 };
  if (data) {
    rates = { ...data.rates, EUR: 1 };
  }

  return {
    loading,
    exchangeRates: rates,
  };
}

export default useExchangeRates;
