import CartProcessingError from "./../errors/CartProcessingError"
import crypto from 'crypto'


export async function processCart(cartObject) {

  //validation
  const cartItems = cartObject.cart_items
  if (cartItems.length === 0) {
    throw new CartProcessingError("Cart contains zero items")
  }

  //call payment svc

  //payment success;
  //look up cart item details via guid
  // to hotel/car/flight svc to construct receipt
  //send user email receipt
  //persist to db
  //pass back payment confirm/ref #
  //GUI emties cart

  //payment fails
  //pass back error to user to correct cart error(s)

  //reference number - relates to checkout db info if success
  const confirmation_id = crypto.randomBytes(16).toString("hex")
  return { status: "succeeded", confirmation_id: confirmation_id }


}
