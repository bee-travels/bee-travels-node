import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"

const { processCreditcardPayment, getExampleChargeData } = require("./dataHandler");
const CreditCardExpiredError = require("./../errors/CreditCardExpiredError");


chai.use(chaiAsPromised);

describe("getData", () => {
  it(" payment should validate valid expiry date then process payment successfully", async () => {

    var chargeObject = await getExampleChargeData(2, 2222)
    expect(chargeObject).not.to.equal(null)

    var result = await processCreditcardPayment(chargeObject)
    expect(result).not.to.equal(null)
    expect(result.status).to.equal("succeeded")
    expect(result.confirmation_id).not.to.equal(null)
    expect(result.confirmation_id.length).to.equal(32)
  })

  it("payment should validate invalid expiry date and fail processing", async () => {

    var chargeObject = await getExampleChargeData(2, 1967)
    expect(chargeObject).not.to.equal(null)
    await expect(processCreditcardPayment(chargeObject)).to.eventually.be.rejectedWith(
      CreditCardExpiredError
    );

  })
});
