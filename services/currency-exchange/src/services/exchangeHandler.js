import axios from "axios";
import CurrencyNotFoundError from "./../errors/CurrencyNotFoundError";

const EXCHANGE_ENDPOINT = "https://api.exchangeratesapi.io";

export async function convert(
  context,
  _from,
  _to = "EUR",
  timeIndicator = "latest"
) {
  const from = _from.toUpperCase();
  const to = _to.toUpperCase();

  const currencyUrl = `${EXCHANGE_ENDPOINT}/${timeIndicator}?base=${from}`;

  let rate;
  try {
    // context.start("exchangeRatesApiCall");
    const { data } = await axios.get(currencyUrl);
    // context.stop();
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

export async function getExchangeRates(context, timeIndicator = "latest") {
  const currencyUrl = `${EXCHANGE_ENDPOINT}/${timeIndicator}`;
  try {
    // context.start("exchangeRatesApiCall");
    const { data } = await axios.get(currencyUrl);
    // context.stop();
    return data;
  } catch (e) {
    if (!(e.response && e.response.data && e.response.data.error)) {
      throw e;
    }
    throw new Error(e.response.data.error);
  }
}

export async function readinessCheck() {
  let data;
  try {
    data = await getExchangeRates();
    if (data) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
