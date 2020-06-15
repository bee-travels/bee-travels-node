import CheckoutProcessingError from "./../errors/CheckoutProcessingError"
import crypto from 'crypto'

import {

  buildCheckoutSavePostgresStatement,
  checkoutSavePostgres,
} from "./postgresService";

import {
  buildCheckoutSaveDb2Statement,
  checkoutSaveDb2
} from "./db2Service"

export async function processCheckout(CheckoutObject) {

  //validation
  const CheckoutItems = CheckoutObject.Checkout_items
  if (CheckoutItems.length === 0) {
    throw new CheckoutProcessingError("Cart contains zero items")
  }

  //call payment svc

  //look up Checkout item details via guid
  // to hotel/car/flight svc to construct receipt???

  //payment success;
  //send user email receipt
  //persist to db
  //pass back payment confirm/ref #
  //reference number - relates to checkout db info if success
  const confirmation_id = crypto.randomBytes(16).toString("hex")
  return { status: "succeeded", confirmation_id: confirmation_id }

  let query;
  switch (process.env.CHECKOUT_DATABASE) {

    case "postgres":
      query = buildCheckoutSavePostgresStatement(
        CheckoutObject
      );
      return await checkoutSavePostgres(query);
    case "db2":
      query = buildCheckoutSaveDb2Statement(
        CheckoutObject
      );
      return await checkoutSaveDb2(query);
    default:
      throw new DatabaseNotFoundError(process.env.CHECKOUT_DATABASE);
  }

  //payment fails
  //pass back error to user to correct Checkout error(s)


}


