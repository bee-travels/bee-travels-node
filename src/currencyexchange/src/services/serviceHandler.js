/**
 * Service for retreiving exchange data from an external API
 *  
 */
import axios from "axios";

export const URL_ENDPOINT = 'https://api.exchangeratesapi.io/latest';

function getCurrencyExchangeRate(countryCurrencyCode) {
  return new Promise(
    function (resolve) {
        if(countryCurrencyCode) {
        axios.get(URL_ENDPOINT)
            .then(function (response){
                if(response.data.rates.hasOwnProperty(countryCurrencyCode) === true){
                    resolve(response.data.rates[countryCurrencyCode]);
                } else {
                    throw new Error(`no key found for currency code ${countryCurrencyCode}`);
                    
                }
            })
            .catch(function (error){
                console.log(error);
            }); 
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
