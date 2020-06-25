import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;
chai.use(chaiHttp);

describe("Checkout API Endpoint Test Group", () => {
  const path = "/api/v1/checkout/cart";

  it("CarRental should send correct cc in body and succeed to : /api/v1/checkout/cart POST", (done) => {
    const request_body = getExampleCheckoutData(2, 2033, "CarRental");

    chai
      .request(app)
      .post(path)
      .set("content-type", "application/json")
      .send(request_body)
      .end((error, response, body) => {
        if (response) {
          console.log(response);
          expect(response.status).to.equal(200);
          expect(response.body.status).to.equal("succeeded");
          expect(response.body.confirmation_id).not.to.equal(null);
          expect(response.body.confirmation_id.length).to.equal(32);

          //confirmation_id is random UUID so best we can do is to check it is not null
          // and of len of 32 e.g. 'd5524a140665fa113369d5e94bc122f9'

          done();
        }
      });
  });

  //   it("Flight booking should send a cart to checkout with invalid cc in body and return an 'Card expired this year' 400 error to : /api/v1/checkout/cart POST", (done) => {

  //     var request_body = getExampleCheckoutData(2, 2020, "Flight")

  //     chai
  //       .request(app)
  //       .post(path)
  //       .set('content-type', 'application/json')
  //       .send(request_body)
  //       .end((error, response, body) => {
  //         if (response) {
  //           expect(response.status).to.equal(400)
  //           expect(response.body.error).to.equal('Card expired this year')
  //           done();
  //         }
  //       });
  //   });

  //   it("Hotel Reservation should send a cart to checkout with invalid cc in body and return an 'Card expired' 400 error to : /api/v1/checkout/cart POST", (done) => {

  //     var request_body = getExampleCheckoutData(2, 1967, 'HotelReservation')

  //     chai
  //       .request(app)
  //       .post(path)
  //       .set('content-type', 'application/json')
  //       .send(request_body)
  //       .end((error, response, body) => {
  //         if (response) {
  //           expect(response.status).to.equal(400)
  //           expect(response.body.error).to.equal('Card expired')
  //           done();
  //         }
  //       });
  //   });
});

//"Car|Hotel|Flight"
function getExampleCheckoutData(exp_month, exp_year, cart_item_type) {
  return {
    total_amount: 499.99,
    currency: "USD",
    status: "unprocessed",
    cart_items: [
      {
        cart_item_type: cart_item_type,
        cart_item_uuid: "string",
        cart_item_cost: 30.99,
        currency: "USD",
        start_date: "05/21/2020",
        end_date: "06/22/2020",
      },
    ],
    billing_details: {
      name: "John Doe",
      phone: "+1 (415) 777 8888",
      email: null,
      address: {
        line1: "42 Arnold Lane",
        line2: "#747",
        city: "Madrid",
        postal_code: "76NE",
        state: null,
        country: "Spain",
      },
    },
    payment_method_details: {
      creditcard_number: "4242 4242 4242 4242",
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: "0017",
    },
  };
}
