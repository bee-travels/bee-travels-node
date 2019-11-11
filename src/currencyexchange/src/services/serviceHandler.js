/**
 * Service for retreiving exchange data from an external API
 *  
 */
import axios from "axios";

export const URL_ENDPOINT = 'https://api.exchangeratesapi.io/latest';

function getCurrencyExchangeRate(countryCode) {
  return new Promise(
    function (resolve) {
        if (countryCode) {
            resolve ({"rate": 0});
        }   
    });
}

function getCurrencyExchangeRates() {
    return new Promise(
      function (resolve) {
          axios.get(URL_ENDPOINT)
            .then(function (response){
                resolve(response.data);
            })
            .catch(function (error){
                console.log(error);
            });
      });
  }
export { getCurrencyExchangeRate, getCurrencyExchangeRates };
