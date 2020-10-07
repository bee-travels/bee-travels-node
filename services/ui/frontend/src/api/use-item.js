import useSWR from "swr";
import fetcher, {fetcher2} from "./fetcher";

function useItem(item, type) {
  const url = `/api/v1/${type}/${item.id}?dateFrom=${item.dateFrom}&dateTo=${item.dateTo}`;
  const {loading, data, error} = useSWR(url, fetcher);
  return {loading, error, data};
}

export function useItems(items) {
  console.log(items);
  const urls = items.map(({item, type}) => {
    return `/api/v1/${type}/${item.id}?dateFrom=${item.dateFrom}&dateTo=${item.dateTo}`;
  })

  console.log(urls);

  const {loading, data, error} = useSWR(JSON.stringify(urls), fetcher2);
  console.log(data, error);
  return {loading, error, data};
}

export default useItem;