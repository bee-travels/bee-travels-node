import axios from "axios";

const PAYMENT_ENDPOINT = "http://localhost:9403";

export async function processPayment(checkout_object) {
  const data = { total_amount: checkout_object.cart.total_amount, currency: checkout_object: currency };
  await axios.post(PAYMENT_ENDPOINT, JSON.parse(data))
    .then(function (res) {
      return res.data;
    })
    .catch(function (err) {
      throw new Error(err.message);
    });
}
