/**
 * Service for retreiving exchange data from an external API
 *  
 */

import { parse } from "fast-csv";
import { createReadStream } from "fs";

function getCurrencyExchangeRate(countryCode) {
  

  return new Promise(function (resolve) {
    if (countryCode) {
        return 0;
    }
  });
}

export { getCurrencyExchangeRate };
