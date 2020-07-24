import { useSelector } from "react-redux";
import queryString from "query-string";
import useSWR from "swr";
import fetcher from "./fetcher";
import { useParams } from "react-router-dom";

export const DEFAULT_MAX = 700;

const fixMin = (x) => (x === 0 ? undefined : x);
const fixMax = (x) => (x === DEFAULT_MAX ? undefined : x);

function useHotels(dateTo, dateFrom) {
  const { country, city } = useParams();
  const hotelFilters = useSelector((state) => state.hotelFilters);

  const query = queryString.stringify({
    superchain:
      hotelFilters.superchains.length > 0
        ? hotelFilters.superchains.join(",")
        : undefined,
    hotel:
      hotelFilters.names.length > 0 ? hotelFilters.names.join(",") : undefined,
    type:
      hotelFilters.types.length > 0 ? hotelFilters.types.join(",") : undefined,
    mincost: fixMin(hotelFilters.minPrice),
    maxcost: fixMax(hotelFilters.maxPrice),
    dateFrom: dateFrom,
    dateTo: dateTo,
  });

  const url = `/api/v1/hotels/${country}/${city}?${query}`;

  const { loading, data, error } = useSWR(url, fetcher);

  return {
    loading,
    error,
    data,
  };
}

export default useHotels;
