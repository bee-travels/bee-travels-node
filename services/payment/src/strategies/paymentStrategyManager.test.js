import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const { getPaymentStrategy, getExampleChargeData } = require("./paymentStrategyManager");
const CreditCardExpiredError = require("./../errors/CreditCardExpiredError");

chai.use(chaiAsPromised);

describe("choose payment strategies based off env vars", () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        process.env = { ...OLD_ENV}
        delete process.env.PAYMENT_PROVIDER
    })

    afterEach(() => {
        process.env = OLD_ENV
    })

    it("should choose default PINGPONG payment strategy", async () => {
        process.env.PAYMENT_PROVIDER = "PINGPONG"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        expect(paymentStrategy).not.to.equal(null)
        expect(paymentStrategy.constructor.name).to.equal('PaymentPingPongStrategy')
    })

    it("should see that STRIPE payment strategy does not exist", async () => {
        process.env.PAYMENT_PROVIDER = "STRIPE"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        expect(paymentStrategy).not.to.equal(null)
        expect(paymentStrategy.constructor.name).to.equal('PaymentStripeStrategy')
    })

    it("default PINGPONG payment should validate valid expiry date then process payment successfully", async () => {
        process.env.PAYMENT_PROVIDER = "PINGPONG"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        expect(paymentStrategy).not.to.equal(null)
        expect(paymentStrategy.constructor.name).to.equal('PaymentPingPongStrategy')

        var chargeObject = await getExampleChargeData(2,2222)
        expect(chargeObject).not.to.equal(null)

        var result = await paymentStrategy.processCreditcardPayment(chargeObject)
        expect(result).not.to.equal(null)
        expect(result.status).to.equal("succeeded")
        expect(result.confirmation_id).not.to.equal(null)
        expect(result.confirmation_id.length).to.equal(32)
    })

    it("default PINGPONG payment should validate invalid expiry date and fail processing", async () => {
        process.env.PAYMENT_PROVIDER = "PINGPONG"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        // expect(paymentStrategy).not.to.equal(null)
        // expect(paymentStrategy.constructor.name).to.equal('PaymentPingPongStrategy')

        var chargeObject = await getExampleChargeData(2,1967)

        await expect(paymentStrategy.processCreditcardPayment(chargeObject)).to.eventually.be.rejectedWith(
            CreditCardExpiredError
          );

    })
})