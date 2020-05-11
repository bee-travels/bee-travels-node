import CreditCardExpiredError from './../errors/CreditCardExpiredError'

export async function processCreditcardPayment(chargeObject) {
  //validation
  var exp_month = chargeObject.payment_method_details.exp_month
  var exp_year = chargeObject.payment_method_details.exp_year

  var currentTime = new Date()
  // returns the month (from 0 to 11)
  var currentMonth = currentTime.getMonth() + 1
  // returns the year (four digits)
  var currentYear = currentTime.getFullYear()

  if (exp_year < currentYear) {
    throw new CreditCardExpiredError("Card expired")
  }
  if (exp_year == currentYear && exp_month < currentMonth) {
    throw new CreditCardExpiredError("Card expired this year")
  }
  const confirmation_id = crypto.randomBytes(16).toString("hex")
  return { status: "succeeded", confirmation_id: confirmation_id }
}

async function getExampleChargeData(exp_month, exp_year) {
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

export { processCreditcardPayment, getExampleChargeData }
