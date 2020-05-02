const {
  getCurrencyExchangeRate,
  getCurrencyExchangeRates,
  convertCurrency,
} = require("./serviceHandler");
const ratesMock = require("./mocks/rates.json");
const axios = require("axios");
const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;

const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

// TODO: Test axios failure cases.

beforeEach(() => {
  // restore if stubbed.
  try {
    axios.get.restore();
  } catch {}
});

describe("getCurrencyExchangeRates", () => {
  it("should work", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    const data = await getCurrencyExchangeRates();
    expect(Object.keys(data.rates).length).to.equal(32);
  });
});

describe("getCurrencyExchangeRate", () => {
  it("should work", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    const data = await getCurrencyExchangeRate("USD");
    expect(data).to.equal(1.1058);
  });

  it("should throw with fake code", async () => {
    const fakeCode = "ABCD";
    sinon.stub(axios, "get").returns(ratesMock);
    await expect(
      getCurrencyExchangeRate(fakeCode)
    ).to.eventually.be.rejectedWith(
      `The country code ${fakeCode} is invalid for the currency you want to convert TO.`
    );
  });

  it("should throw with fake base code", async () => {
    const fakeCode = "ABCD";
    sinon.stub(axios, "get").rejects({ response: { status: 400 } });

    await expect(
      getCurrencyExchangeRate("USD", fakeCode)
    ).to.eventually.be.rejectedWith(
      `The country code ${fakeCode} is invalid for the currency you want to convert FROM.`
    );
  });

  it("should throw with no code specified", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    await expect(getCurrencyExchangeRate()).to.eventually.be.rejectedWith(
      "please provide a currency code"
    );
  });
});

describe("convertCurrency", () => {
  it("should return a numeric rate", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    const data = await convertCurrency(10, "EUR", "USD", "latest");
    expect(data).to.equal(11.058);
  });
});
