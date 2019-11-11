import { getCurrencyExchangeRate, getCurrencyExchangeRates } from "../../src/services/serviceHandler";

import { describe, it } from "mocha";
import { assert, expect } from "chai";

describe("Get all currency exchange rates", () => {
  it("should return all 3 letter country codes with currency for the day", done => {
    var currencyRateByCountryData = getCurrencyExchangeRates();
    currencyRateByCountryData.then(data => {
      assert(data.rates !== null, "Data should have a Dict called 'rates'");
      //assert(Object.keys(data.rates).length === 31), "Should have x number of rate entries"
      assert(data.base === "EUR", "base rate should be EUR");
      done();
    }).catch(err => {
      done(err);
    });
  });
});

// describe("Get a specific rate for a specific country code that does not exist, i.e. USA", () => {
//   it("should return a rate for a specific country code", (done) => {
//     var currencyRateByCountryData = getCurrencyExchangeRate("USA");
//     currencyRateByCountryData.then(err => {
//       assert.throws(
//         () => { throw new Error("Error thrown"); }, err, "No country code USA");
//         done();
      
//     }).catch(err => {
//       assert()
//       done(err);
//     });
//   });
// });

describe("Get a specific rate for a specific country code that does exist, i.e. USD", () => {
  it("should return a numeric rate for a specific country code", (done) => {
    var currencyRateByCountryData = getCurrencyExchangeRate("USD");
    currencyRateByCountryData.then(data => {
      assert(isNaN(data) === false, "expect daily rate as a number");
      done();
    }).catch(err => {
      assert()
      done(err);
    });
  });
});