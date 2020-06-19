import axios from "axios";

const EMAIL_ENDPOINT = "http://localhost:9301/api/v1/emails"



export default async function sendMail(invoice_id, checkout_object) {
  console.log(checkout_object);

  //send user basic - email receipt
  const emailBody = await formatEmailBody(invoice_id, checkout_object)

  console.log(emailBody)
  const data = {
    email: checkout_object.billing_details.email,
    from: "grant.steinfeld.tech@gmail.com",
    subject: "Bee Travels booking",
    body: emailBody
  }
  const res = await axios.post(EMAIL_ENDPOINT, data)
  return res.data
}


async function formatEmailBody(invoice_id, checkout_object) {

  /*
  text
 email body

  cart_items: [
    {
      cart_item_type: cart_item_type,
      cart_item_uuid: "string",
      cart_item_cost: 30.99,
      currency: "USD",
      start_date: "05/21/2020",
      end_date: "06/22/2020"
    }
  ]
*/
  const lines = []


  lines.push(`Dear ${checkout_object.billing_details.name},`)
  lines.push("")

  lines.push(" Bee Travels Email Receipt ")
  lines.push("===========================")
  lines.push("")
  lines.push("")
  lines.push("You just booked: ")

  checkout_object.cart_items.forEach(item => {

    console.log(item)
    lines.push("")
    lines.push(`Item${item.cart_item_type} in the amount of:  ${item.currency}${item.cart_item_cost}`)
    lines.push("")
  });

  lines.push("")
  lines.push(`Total amount paid was ${checkout_object.currency}${checkout_object.total_amount}`)

  lines.push("")
  lines.push(`Your confirmation code is ${invoice_id}`)
  lines.push("")
  lines.push("")
  lines.push("Thank you for choosing Bee Travels!")
  lines.push("")
  lines.push("The Bee Travels team!")
  lines.push("")

  return lines.join("\r\n")

}
