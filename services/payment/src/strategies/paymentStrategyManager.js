import PaymentPingPongStrategy from './paymentPingPongStrategy'
import PaymentStripeStrategy from './paymentStripeStrategy'
import NotFoundError from '../errors/NotFoundError'

async function getPaymentStrategy(paymentProvider)
{
  var paymentStrategy = null

    switch(paymentProvider){
        case 'PINGPONG':
            paymentStrategy = new PaymentPingPongStrategy()
            break
        case 'STRIPE':
            paymentStrategy = new PaymentStripeStrategy()
            break
        case 'undefined':
            throw new Error('please set Environment Variable PAYMENT_PROVIDER')
        default:
            throw new NotFoundError(`no such strategy for payment provider -> ${paymentProvider.toUpperCase()}`)
    }

  return paymentStrategy
}

async function getExampleChargeData(exp_month, exp_year){
  return {
    invoice: "invoice_73BC3",
    statement_descriptor: "BeeTravels.com/r/73BC3",
    amount: 499.99,
    currency: "USD",
    status: "unprocessed",
    billing_details: {
      name: "John Doe",
      phone: "+1 (415) 777 8888",
      email: null,
      address: {
        line1: "42 Arnold Lane",
        line2: "#747",
        city: "Madrid",
        postal_code: "76NE",
        state: null,
        country: "Spain"
      }
    },
    payment_method_details: {
      creditcard_number: "4242 4242 4242 4242",
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: "0017"
    }
  }
}
export { getPaymentStrategy, getExampleChargeData }