/**
 * Service for retreiving exchange data from an external API
 *  https://api.exchangeratesapi.io/latest
 */


function getCurrencyExchangeRate(countryCode) {
  

  return new Promise(function (resolve) {
    if (countryCode) {
        return 0;
    }
  });
}

export { getCurrencyExchangeRate };
