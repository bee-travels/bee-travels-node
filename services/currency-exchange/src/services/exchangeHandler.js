import axios from "axios";
import CurrencyNotFoundError from "./../errors/CurrencyNotFoundError";

const EXCHANGE_ENDPOINT = "https://api.exchangeratesapi.io";

export async function convert(_from, _to = "EUR", timeIndicator = "latest") {
  const from = _from.toUpperCase();
  const to = _to.toUpperCase();

  const currencyUrl = `${EXCHANGE_ENDPOINT}/${timeIndicator}?base=${from}`;

  let rate;
  try {
    const { data } = await axios.get(currencyUrl);
    rate = data.rates[to];
  } catch (e) {
    if (!(e.response && e.response.data && e.response.data.error)) {
      throw e;
    }
    if (e.response.data.error.includes(from)) {
      throw new CurrencyNotFoundError(from);
    }
    throw new Error(e.response.data.error);
  }

  if (rate === undefined) {
    throw new CurrencyNotFoundError(to);
  }
  return rate;
}

export async function getExchangeRates(timeIndicator = "latest") {
  const currencyUrl = `${EXCHANGE_ENDPOINT}/${timeIndicator}`;
  try {
    const { data } = await axios.get(currencyUrl);
    return data;
  } catch (e) {
    if (!(e.response && e.response.data && e.response.data.error)) {
      throw e;
    }
    throw new Error(e.response.data.error);
  }
}
