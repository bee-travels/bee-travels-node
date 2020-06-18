import axios from "axios";

const PAYMENT_ENDPOINT = "http://localhost:9403/api/v1/payment/charge";

export default async function processPayment(invoice_id, statement_descriptor, checkout_object) {

  const data = getChargeData(invoice_id, statement_descriptor, checkout_object);
  const res = await axios.post(PAYMENT_ENDPOINT, data)
  return res.data;


}

function getChargeData(invoice_id, statement_descriptor, checkout_object) {
  return {
    invoice: invoice_id,
    statement_descriptor: statement_descriptor,
    amount: checkout_object.total_amount,
    currency: checkout_object.currency,
    status: 'pre-payment',
    billing_details: checkout_object.billing_details,
    payment_method_details: checkout_object.payment_method_details
  }
}
