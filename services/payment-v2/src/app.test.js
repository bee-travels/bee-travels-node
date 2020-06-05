import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

describe('Payment API Endpoint Test Group', () => {
  //const ip_address = process.env.IP
  //const port = process.env.PORT
  const ip_address = 'localhost'
  const port = 9403

  const host = "http://" + ip_address + ':' + port;
  const path = "/api/v1/payment/charge";

  it('should send correct cc in body and succeed to : /api/v1/payment/charge POST', (done) => {

    const body = {
      invoice: "invoice_73BC3",
      statement_descriptor: "BeeTravels.com/r/73BC3",
      amount: 499.99,
      currency: "USD",
      status: "unprocessed",
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
          country: "Spain"
        }
      },
      payment_method_details: {
        creditcard_number: "4242 4242 4242 4242",
        exp_month: 2,
        exp_year: 2023,
        cvc: "0017"
      }
    }

    //confirmation_id is random UUID
    const expected = {
      status: "succeeded",
      confirmation_id: "ba7c07c990bf137d164242e631418268"
    }

    chai
      .request(host)
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(body)
      .end((error, response, body) => {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
  });

  it('should send invalid cc in body and return an error to : /api/v1/payment/charge POST', (done) => {

    const body = {
      invoice: "invoice_73BC3",
      statement_descriptor: "BeeTravels.com/r/73BC3",
      amount: 499.99,
      currency: "USD",
      status: "unprocessed",
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
          country: "Spain"
        }
      },
      payment_method_details: {
        creditcard_number: "4242 4242 4242 4242",
        exp_month: 2,
        exp_year: 2020,
        cvc: "0017"
      }
    }

    //confirmation_id is random UUID
    const expected = {
      status: "succeeded",
      confirmation_id: "ba7c07c990bf137d164242e631418268"
    }

    chai
      .request(host)
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(body)
      .end((error, response, body) => {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
  });

});
