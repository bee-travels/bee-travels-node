import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const { getCurrency, getCountry } = require("./infoHandler");
const CurrencyNotFoundError = require("./../errors/CurrencyNotFoundError");
const CountryNotFoundError = require("./../errors/CountryNotFoundError");

chai.use(chaiAsPromised);

describe("getCountry", () => {
  it("should return a error for a non-existent country Westeros", async () => {
    await expect(getCountry("Westeros")).to.eventually.be.rejectedWith(
      CountryNotFoundError
    );
  });

  it("should return metadata for a specific country, i.e.South Africa", async () => {
    const data = await getCountry("South Africa");

    expect(data).to.deep.equal({
      country: "South Africa",
      currency: "South African rand",
      code: "ZAR",
    });
  });
});

describe("getCurrency", () => {
  it("should throw with fake code", async () => {
    const fakeCode = "ABCD";
    await expect(getCurrency(fakeCode)).to.eventually.be.rejectedWith(
      CurrencyNotFoundError
    );
  });

  it("should return metadata for a specific country code, i.e. ZAR", async () => {
    const data = await getCurrency("ZAR");
    expect(data).to.deep.equal({
      code: "ZAR",
      currency: "South African rand",
      countries: ["South Africa"],
    });
  });

  it("should return metadata for a specific country code, i.e. USD", async () => {
    const data = await getCurrency("USD");
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
      code: "USD",
      currency: "United States dollar",
      countries: expectedCountries,
    });
  });
});
