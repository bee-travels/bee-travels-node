import CheckoutProcessingError from "./../errors/CheckoutProcessingError";
import crypto from "crypto";

import {
  buildCheckoutSavePostgresStatement,
  checkoutSavePostgres
} from "./postgresService";

import processPayment from './serviceHandler'
import sendMail from './emailService'

import { buildCheckoutSaveDb2Statement, checkoutSaveDb2 } from "./db2Service";
export async function getData() {
  return 'success'
}
export async function processCheckout(checkoutObject) {
  //validation
  const cart_items = checkoutObject.cart_items;
  if (cart_items.length === 0) {
    throw new CheckoutProcessingError("Cart contains zero items");
  }

  //setup for processing payment
  //create an invoice id
  const invoice_id = crypto.randomBytes(16).toString("hex");
  //this is what typically shows up on cc statements
  const statement_descriptor = `need help: https://BeeTravels.info/r/${invoice_id}`;
  try {
    var postProcessPaymentResult = await processPayment(invoice_id, statement_descriptor, checkoutObject);
  } catch (payex) {
    console.error(payex)
    return payex.message
  }
  console.log(">>>>")
  console.log(postProcessPaymentResult)

  // return {
  //   "status": "succeeded",
  //   "confirmation_id": "23ea1233a8fcde349ad5671e647e1c06"
  // }

  if (postProcessPaymentResult.status == "succeeded") {
    let sentMail = await sendMail(invoice_id, checkoutObject);

    console.log(sentMail)
    if (sentMail[0].statusCode == 202) {
      //persist to db
      postProcessPaymentResult.mailId = 202; //sentMail[0].headers["x-message-id"];

    }

    return postProcessPaymentResult;
  } else {
    throw new CheckoutProcessingError(postProcessPaymentResult.message);
  }








  //persist to db




  /*
  let query;
  switch (process.env.CHECKOUT_DATABASE) {

    case "postgres":
      query = buildCheckoutSavePostgresStatement(
        checkoutObject
      );
      return await checkoutSavePostgres(query);
    case "db2":
      query = buildCheckoutSaveDb2Statement(
        checkoutObject
      );
      return await checkoutSaveDb2(query);
    default:
      throw new DatabaseNotFoundError(process.env.CHECKOUT_DATABASE);
  }

  //payment fails
  //pass back error to user to correct Checkout error(s)

*/
}

export function readinessCheck() {
  //db2 or postGres
  //call
  //email svc
  //payment svc

  return true;
}
