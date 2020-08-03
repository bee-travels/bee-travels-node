import useSWR from "swr";
import fetcher from "./fetcher";

function useInfo(url) {
  const { loading, data, error } = useSWR(url, fetcher);

  return {
    loading,
    error,
    data,
  };
}

export default useInfo;
