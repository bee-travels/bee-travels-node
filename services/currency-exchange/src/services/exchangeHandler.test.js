import ratesMock from "./mocks/rates.json";
import axios from "axios";
import { describe, it } from "mocha";
import sinon from "sinon";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const { convert, getExchangeRates } = require("./exchangeHandler");
const CurrencyNotFoundError = require("./../errors/CurrencyNotFoundError");

const context = {
  start: () => {},
  stop: () => {},
};

chai.use(chaiAsPromised);

beforeEach(() => {
  // restore if stubbed.
  try {
    axios.get.restore();
  } catch {}
});

describe("getExchangeRates", () => {
  it("returns a list of all exchange rates", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    const data = await getExchangeRates(context);
    expect(Object.keys(data.rates).length).to.equal(32);
  });
});

describe("convert", () => {
  it("returns the exchange rate for converting one currency to another", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    const data = await convert(context, "USD");
    expect(data).to.equal(1.1058);
  });

  it("throws with a fake `to` currency code", async () => {
    const fakeCode = "ABCD";
    sinon.stub(axios, "get").returns(ratesMock);
    await expect(
      convert(context, "USD", fakeCode)
    ).to.eventually.be.rejectedWith(CurrencyNotFoundError);
  });

  it("throws with a fake `from` currency code", async () => {
    const fakeCode = "ABCD";
    sinon.stub(axios, "get").rejects({ response: { status: 400 } });

    await expect(convert(context, fakeCode)).to.eventually.be.rejectedWith(
      CurrencyNotFoundError
    );
  });
});
