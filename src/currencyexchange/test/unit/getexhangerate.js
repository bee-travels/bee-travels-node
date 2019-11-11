import { getCurrencyExchangeRate, getCurrencyExchangeRates } from "../../src/services/serviceHandler";

import { describe, it } from "mocha";
import { assert } from "chai";

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

describe("Get a specific rate for a specific country code", () => {
  it("should return a rate for a specific country code", done => {
    var currencyRateByCountryData = getCurrencyExchangeRate("USA");
    currencyRateByCountryData.then(data => {
      assert(data.rate === 1.1034, "rate for a specific country code should be 1.1034");  // AS this changes daily -> mocks NB!!
      done();
    }).catch(err => {
      done(err);
    });
  });
});