import axios from "axios";

const EMAIL_URL = process.env.EMAIL_URL || "http://localhost:9301";

export default async function sendMail(confirmationId, checkoutObject) {
  const emailBody = formatEmailBody(confirmationId, checkoutObject);

  const data = {
    email: checkoutObject.billingDetails.email,
    from: "no-reply@beetravels.com",
    subject: "Bee Travels Booking Confirmation",
    body: emailBody,
  };

  const res = await axios.post(EMAIL_URL + "/api/v1/emails", data);

  return res.data;
}

function formatEmailBody(confirmationId, checkoutObject) {
  let emailBody = `Dear ${checkoutObject.billingDetails.firstName} ${checkoutObject.billingDetails.lastName},\r\n
  \r\n
  Bee Travels Itinerary for Confirmation #${confirmationId}\r\n
  =========================\r\n`;

  for (let item = 0; item < checkoutObject.cartItems.length; item++) {
    let cartItem = checkoutObject.cartItems[item];
    emailBody =
      emailBody +
      `${cartItem.type}: ${cartItem.description} (${cartItem.startDate} - ${cartItem.endDate}): ${cartItem.cost} ${cartItem.currency}\r\n`;
  }

  emailBody =
    emailBody +
    `=========================\r\n
  Total: ${checkoutObject.totalAmount} ${checkoutObject.currency}\r\n
  \r\n
  Thank you for choosing Bee Travels,\r\n\r\n
  The Bee Travels team\r\n\r\n
  Where will you bee traveling next?`;

  return emailBody;
}
