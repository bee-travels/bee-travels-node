import { useSelector } from "react-redux";
import queryString from "query-string";
import useSWR from "swr";
import fetcher from "./fetcher";
import { useParams } from "react-router-dom";

export const DEFAULT_MAX = 700;

const fixMin = (x) => (x === 0 ? undefined : x);
const fixMax = (x) => (x === DEFAULT_MAX ? undefined : x);

function useCars() {
  const { country, city } = useParams();
  const carFilters = useSelector((state) => state.carFilters);

  const query = queryString.stringify({
    company:
      carFilters.rentalCompanies.length > 0
        ? carFilters.rentalCompanies.join(",")
        : undefined,
    car: carFilters.names.length > 0 ? carFilters.names.join(",") : undefined,
    type: carFilters.types.length > 0 ? carFilters.types.join(",") : undefined,
    style:
      carFilters.carStyles.length > 0
        ? carFilters.carStyles.join(",")
        : undefined,
    mincost: fixMin(carFilters.minPrice),
    maxcost: fixMax(carFilters.maxPrice),
    dateFrom: carFilters.dateFrom,
    dateTo: carFilters.dateTo,
  });

  const url = `/api/v1/cars/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(url, fetcher);

  return {
    loading,
    error,
    data,
  };
}

function useFlightsNonStop() {
  const { country, city } = useParams();
  const flightFilters = useSelector((state) => state.flightFilters);

  const query = queryString.stringify({
    mincost: fixMin(flightFilters.minPrice),
    maxcost: fixMax(flightFilters.maxPrice),
    dateFrom: flightFilters.dateFrom,
    dateTo: flightFilters.dateTo,
  });

  const url = `/api/v1/cars/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(url, fetcher);

  return {
    loading,
    error,
    data,
  };
}

function useFlightsOneStop() {
  const { country, city } = useParams();
  const flightFilters = useSelector((state) => state.flightFilters);

  const query = queryString.stringify({
    mincost: fixMin(flightFilters.minPrice),
    maxcost: fixMax(flightFilters.maxPrice),
    dateFrom: flightFilters.dateFrom,
    dateTo: flightFilters.dateTo,
  });

  const url = `/api/v1/cars/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(url, fetcher);

  return {
    loading,
    error,
    data,
  };
}

function useFlightsTwoStop() {
  const { country, city } = useParams();
  const flightFilters = useSelector((state) => state.flightFilters);

  const query = queryString.stringify({
    mincost: fixMin(flightFilters.minPrice),
    maxcost: fixMax(flightFilters.maxPrice),
    dateFrom: flightFilters.dateFrom,
    dateTo: flightFilters.dateTo,
  });

  const url = `/api/v1/cars/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(url, fetcher);

  return {
    loading,
    error,
    data,
  };
}

export default useCars;
