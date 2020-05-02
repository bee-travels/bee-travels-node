/**
 * Service for getting exchange data
 * from an external API
 */
const axios = require("axios");
const NotFoundError = require("../errors/NotFoundError");

const BASE_URL_ENDPOINT = "https://api.exchangeratesapi.io/";
module.exports.BASE_URL_ENDPOINT = BASE_URL_ENDPOINT;

async function getCurrencyExchangeRate(
  countryCurrencyCode,
  baseCode = "EUR",
  timeIndicator = "latest"
) {
  baseCode = baseCode.toUpperCase();
  if (countryCurrencyCode) {
    countryCurrencyCode = countryCurrencyCode.toUpperCase();

    const currencyUrl = `${BASE_URL_ENDPOINT}${timeIndicator}?base=${baseCode}`;

    try {
      const { data } = await axios.get(currencyUrl);
      if (data.rates[countryCurrencyCode]) {
        return data.rates[countryCurrencyCode];
      } else {
        //currencyToCode is invalid
        throw new NotFoundError(
          `The country code ${countryCurrencyCode} is invalid for the currency you want to convert TO.`
        );
      }
    } catch (e) {
      // TODO: this also catch the above error that was already thrown...
      if (e.response && e.response.status === 400) {
        //currencyFromCode is invalid
        // TODO: could also be an invalid time indicator
        throw new NotFoundError(
          `The country code ${baseCode} is invalid for the currency you want to convert FROM.`
        );
      } else {
        throw e;
      }
    }
  }
  throw new NotFoundError(`please provide a currency code`);
}

async function getCurrencyExchangeRates(timeIndicator = "latest") {
  const currencyUrl = `${BASE_URL_ENDPOINT}${timeIndicator}`;
  const { data } = await axios.get(currencyUrl);
  return data;
}

async function convertCurrency(
  fromValue,
  fromCurrencyCode,
  toCurrencyCode,
  historicalDate
) {
  const exchangeRate = await getCurrencyExchangeRate(
    toCurrencyCode,
    fromCurrencyCode,
    historicalDate
  );
  return fromValue * exchangeRate;
}

module.exports.getCurrencyExchangeRate = getCurrencyExchangeRate;
module.exports.getCurrencyExchangeRates = getCurrencyExchangeRates;
module.exports.convertCurrency = convertCurrency;
