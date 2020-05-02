import {getPaymentStrategy, getExampleChargeData} from './paymentStrategyManager'

describe("choose payment strategies based off env vars", () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV}
        delete process.env.PAYMENT_PROVIDER
    })

    afterEach(() => {
        process.env = OLD_ENV
    })

    it("should choose default PINGPONG payment strategy", async () => {
        process.env.PAYMENT_PROVIDER = "PINGPONG"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        expect(paymentStrategy).not.toBeNull()
        expect(paymentStrategy.constructor.name).toBe('PaymentPingPongStrategy')
    })

    it("should see that STRIPE payment strategy does not exist", async () => {
        process.env.PAYMENT_PROVIDER = "STRIPE"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        expect(paymentStrategy).not.toBeNull()
        expect(paymentStrategy.constructor.name).toBe('PaymentStripeStrategy')
    })

    it("default PINGPONG payment should validate valid expiry date then process payment successfully", async () => {
        process.env.PAYMENT_PROVIDER = "PINGPONG"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        expect(paymentStrategy).not.toBeNull()
        expect(paymentStrategy.constructor.name).toBe('PaymentPingPongStrategy')

        var chargeObject = await getExampleChargeData(2,2222)

        var result = paymentStrategy.processCreditcardPayment(chargeObject)
        expect(result.status).toEqual("succeeded")
        expect(result.confirmation_id).not.toBeNull()
        //9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
        expect(result.confirmation_id.length).toEqual(36)
    })

    it("default PINGPONG payment should validate invalid expiry date and fail processing", async () => {
        process.env.PAYMENT_PROVIDER = "PINGPONG"
        const paymentStrategy = await getPaymentStrategy(process.env.PAYMENT_PROVIDER)
        expect(paymentStrategy).not.toBeNull()
        expect(paymentStrategy.constructor.name).toBe('PaymentPingPongStrategy')

        var chargeObject = await getExampleChargeData(2,1967)

        var result = paymentStrategy.processCreditcardPayment(chargeObject)
        expect(result.status).toEqual("card_expired")
        expect(result.confirmation_id).toBeNull()
        
    })
})