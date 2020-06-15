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
  const cart_items = CheckoutObject.cart_items
  if (cart_items.length === 0) {
    throw new CheckoutProcessingError("Cart contains zero items")
  }

  //call payment svc

  //look up Checkout item details via guid
  // if car look by guid -> ford xxx ( start end)
  // to hotel/car/flight svc to construct receipt???

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
  const confirmation_id = crypto.randomBytes(16).toString("hex")
  return { status: "succeeded", confirmation_id: confirmation_id }

  /*
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

*/
}


export function readinessCheck() {


  //db2 or postGres
  //call
  //email svc
  //payment svc

  return true;
}
