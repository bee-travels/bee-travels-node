import CheckoutProcessingError from "./../errors/CheckoutProcessingError";
import crypto from "crypto";

import {
  buildCheckoutSavePostgresStatement,
  checkoutSavePostgres
} from "./postgresService";

import processPayment from './serviceHandler'

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
  const statement_descriptor = `BeeTravels.com/r/${invoice_id}`;
  var postProcessPaymentResult = await processPayment(invoice_id, statement_descriptor, checkoutObject);

  //call payment svc
  // await processPayment(invoice_id, statement_descriptor, checkoutObject).then((res, bez) => {
  //   console.log("unpromising!")
  //   console.log(res)
  //   console.log(bez)
  //   postProcessPaymentResult = res
  // }).catch(function (err) {
  //   console.error(err)
  // });

  console.log(">>>>")
  console.log(postProcessPaymentResult)


  return postProcessPaymentResult;

  // return {
  //   "status": "succeeded",
  //   "confirmation_id": "23ea1233a8fcde349ad5671e647e1c06"
  // }

  //const confirmation_id = crypto.randomBytes(16).toString("hex");

  //payment success;
  //send user basic - email receipt

  /*
    text
    you've booked
    1 car
    2 hotels
    1 flight
    confirmationid
    total price



  */

  //persist to db
  //pass back payment confirm/ref #
  //reference number - relates to checkout db info if success

  // const sql_statement = await buildCheckoutSavePostgresStatement(checkoutObject, confirmation_id);
  // const result = await checkoutSavePostgres(sql_statement);
  // console.log(result);
  //return { status: "succeeded", confirmation_id: postProcessPaymentResult };





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
