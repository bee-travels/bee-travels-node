import NotYetImplementedError from '../errors/NotYetImplementedError'

export default class PaymentStripeStrategy {
    
    constructor(){
        this.name = "stripe"
    }

    async processCreditcardPayment(customerInfo, billingInfo, transaction,merchant)
    {
        throw new NotYetImplementedError('Stripe API')
    }
}