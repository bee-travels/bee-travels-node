import axios from "axios";

const PAYMENT_URL = process.env.PAYMENT_URL || "http://localhost:9403";

export async function processPayment(totalAmount, billingDetails, cardDetails) {
  const data = {
    totalAmount: totalAmount,
    billingDetails: billingDetails,
    cardDetails: cardDetails,
  };
  const res = await axios.post(PAYMENT_URL + "/api/v1/payment/charge", data);
  return res.data.confirmationId;
}

export async function paymentReadinessCheck() {
  const isReady = await axios.get(PAYMENT_URL + "/ready");
  return isReady;
}
