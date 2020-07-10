import CheckoutProcessingError from "./../errors/CheckoutProcessingError";
import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";

import {
  buildCheckoutPostgresQuery,
  setCheckoutDataToPostgres,
  postgresReadinessCheck,
} from "./postgresService";

import { processPayment, paymentReadinessCheck } from "./paymentService";
import { sendMail, emailReadinessCheck } from "./emailService";

export async function processCheckout(context, checkoutObject) {
  isValid(checkoutObject.cartItems);

  try {
    context.start("processPayment");
    const confirmationId = await processPayment(
      checkoutObject.totalAmount,
      checkoutObject.billingDetails,
      checkoutObject.paymentMethodDetails
    );
    context.stop();

    await savePurchaseToDatabase(context, confirmationId, checkoutObject);

    if (checkoutObject.billingDetails.email) {
      context.start("sendMail");
      let sentMail = await sendMail(confirmationId, checkoutObject);
      context.stop();

      if (sentMail[0].statusCode !== 202) {
        console.log("Error sending confirmation email");
      }
    }

    return { confirmationId: confirmationId };
  } catch (e) {
    throw new CheckoutProcessingError(e.message);
  }
}

async function savePurchaseToDatabase(context, confirmationId, checkoutObject) {
  let query;
  switch (process.env.CHECKOUT_DATABASE) {
    case "postgres":
      query = buildCheckoutPostgresQuery(confirmationId, checkoutObject);
      context.start("setCheckoutDataToPostgres");
      await setCheckoutDataToPostgres(query, context);
      context.stop();
      break;
    default:
      break;
  }
}

function isValid(cartItems) {
  switch (process.env.CHECKOUT_DATABASE) {
    case "postgres":
      if (cartItems === undefined || cartItems.length === 0) {
        throw new CheckoutProcessingError("Cart contains zero items");
      }
      break;
    default:
      throw new DatabaseNotFoundError(process.env.CHECKOUT_DATABASE);
  }
}

export async function readinessCheck() {
  try {
    let postgresIsReady;
    switch (process.env.CHECKOUT_DATABASE) {
      case "postgres":
        postgresIsReady = await postgresReadinessCheck();
        break;
      default:
        postgresIsReady = false;
    }
    const paymentIsReady = await paymentReadinessCheck();
    const emailIsReady = await emailReadinessCheck();

    return postgresIsReady && paymentIsReady && emailIsReady;
  } catch (e) {
    return false;
  }
}
