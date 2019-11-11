/**
 * Service for retreiving exchange data from an external API
 *  https://api.exchangeratesapi.io/latest
 */

import { axios } from "axios";
function getCurrencyExchangeRate(countryCode) {
  

  return new Promise(
    function (resolve) {
        if (countryCode) {
            resolve ({"rate": 0});
        }   
    });
}

export { getCurrencyExchangeRate };
