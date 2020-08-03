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
  const flightFilters = useSelector((state) => state.flightFilters);

  const query = queryString.stringify({
    company:
      flightFilters.rentalCompanies.length > 0
        ? flightFilters.rentalCompanies.join(",")
        : undefined,
    type:
      flightFilters.types.length > 0
        ? flightFilters.types.join(",")
        : undefined,
    mincost: fixMin(flightFilters.minPrice),
    maxcost: fixMax(flightFilters.maxPrice),
    dateFrom: flightFilters.dateFrom,
    dateTo: flightFilters.dateTo,
  });

  const url = `/api/v1/flights/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(
    flightFilters.dateFrom && flightFilters.dateTo ? url : null,
    fetcher
  );

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

  const url = `/api/v1/flights/direct/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(
    flightFilters.dateFrom && flightFilters.dateTo ? url : null,
    fetcher
  );

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

  const url = `/api/v1/flights/onestop/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(
    flightFilters.dateFrom && flightFilters.dateTo ? url : null,
    fetcher
  );

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

  const url = `/api/v1/flights/twostop/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(
    flightFilters.dateFrom && flightFilters.dateTo ? url : null,
    fetcher
  );

  return {
    loading,
    error,
    data,
  };
}

export default useCars;
