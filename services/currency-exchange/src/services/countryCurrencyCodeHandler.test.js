import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const {
  getCurrencyNameAndCode,
  getCountryAndCurrencyCode,
} = require("./countryCurrencyCodeHandler");

chai.use(chaiAsPromised);

describe("getCurrencyNameAndCode", () => {
  it("should return a error country is required", async () => {
    await expect(getCurrencyNameAndCode()).to.eventually.be.rejectedWith(
      "please pass in a country name"
    );
  });

  it("should return a error for a non-existent country Westeros", async () => {
    await expect(
      getCurrencyNameAndCode("Westeros")
    ).to.eventually.be.rejectedWith(
      "no country found for country name Westeros"
    );
  });

  it("should return metadata for a specific country, i.e.South Africa", async () => {
    const data = await getCurrencyNameAndCode("South Africa");

    expect(data).to.deep.equal({
      country: "South Africa",
      currencyName: "South African rand",
      currencyCode: "ZAR",
    });
  });
});

describe("getCountryAndCurrencyCode", () => {
  it("should throw with fake code", async () => {
    const fakeCode = "ABCD";
    await expect(
      getCountryAndCurrencyCode(fakeCode)
    ).to.eventually.be.rejectedWith(`currency code ${fakeCode} not found`);
  });

  it("should throw with no code", async () => {
    await expect(getCountryAndCurrencyCode()).to.eventually.be.rejectedWith(
      "please pass in a 3 character currency code"
    );
  });

  it("should return metadata for a specific country code, i.e. ZAR", async () => {
    const data = await getCountryAndCurrencyCode("ZAR");
    expect(data).to.deep.equal({
      currencyCode: "ZAR",
      currencyName: "South African rand",
      country: ["South Africa"],
    });
  });

  it("should return metadata for a specific country code, i.e. USD", async () => {
    const data = await getCountryAndCurrencyCode("USD");
    const expectedCountries = [
      "American Samoa",
      "Bonaire",
      "British Indian Ocean Territory",
      "British Virgin Islands",
      "Caribbean Netherlands",
      "Ecuador",
      "El Salvador",
      "Guam",
      "Marshall Islands",
      "Micronesia",
      "Northern Mariana Islands",
      "Palau",
      "Panama",
      "Puerto Rico",
      "Saba",
      "Sint Eustatius",
      "Timor-Leste",
      "Turks and Caicos Islands",
      "United States of America",
      "US Virgin Islands",
      "Wake Island",
      "Zimbabwe",
    ];

    expect(data).to.deep.equal({
      currencyCode: "USD",
      currencyName: "United States dollar",
      country: expectedCountries,
    });
  });
});
