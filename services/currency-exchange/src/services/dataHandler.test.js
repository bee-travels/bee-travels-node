import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const { getCurrency, getCountry } = require("./dataHandler");
const CurrencyNotFoundError = require("./../errors/CurrencyNotFoundError");
const CountryNotFoundError = require("./../errors/CountryNotFoundError");

const context = {
  start: () => {},
  stop: () => {},
};

chai.use(chaiAsPromised);

describe("getCountry", () => {
  it("returns metadata given a valid country", async () => {
    const data = await getCountry("South Africa", context);

    expect(data).to.deep.equal({
      country: "South Africa",
      currency: "South African rand",
      code: "ZAR",
    });
  });

  it("throws given a fake country", async () => {
    await expect(getCountry("Westeros", context)).to.eventually.be.rejectedWith(
      CountryNotFoundError
    );
  });
});

describe("getCurrency", () => {
  it("returns metadata with one country given a valid code", async () => {
    const data = await getCurrency("ZAR", context);
    expect(data).to.deep.equal({
      code: "ZAR",
      currency: "South African rand",
      countries: ["South Africa"],
    });
  });

  it("returns metadata with many countries given a valid code", async () => {
    const data = await getCurrency("USD", context);
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

  it("throws given a fake code", async () => {
    const fakeCode = "ABCD";
    await expect(getCurrency(fakeCode, context)).to.eventually.be.rejectedWith(
      CurrencyNotFoundError
    );
  });
});
