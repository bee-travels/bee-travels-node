import ratesMock from "./mocks/rates.json";
import axios from "axios";
import { describe, it } from "mocha";
import sinon from "sinon";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const { convert, getExchangeRates } = require("./exchangeHandler");
const CurrencyNotFoundError = require("./../errors/CurrencyNotFoundError");

chai.use(chaiAsPromised);

beforeEach(() => {
  // restore if stubbed.
  try {
    axios.get.restore();
  } catch {}
});

describe("getExchangeRates", () => {
  it("should work", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    const data = await getExchangeRates();
    expect(Object.keys(data.rates).length).to.equal(32);
  });
});

describe("convert", () => {
  it("should work", async () => {
    sinon.stub(axios, "get").returns(ratesMock);
    const data = await convert("USD");
    expect(data).to.equal(1.1058);
  });

  it("should throw with fake code", async () => {
    const fakeCode = "ABCD";
    sinon.stub(axios, "get").returns(ratesMock);
    await expect(convert(fakeCode)).to.eventually.be.rejectedWith(
      CurrencyNotFoundError
    );
  });

  it("should throw with fake base code", async () => {
    const fakeCode = "ABCD";
    sinon.stub(axios, "get").rejects({ response: { status: 400 } });

    await expect(convert("USD", fakeCode)).to.eventually.be.rejectedWith(
      CurrencyNotFoundError
    );
  });
});
