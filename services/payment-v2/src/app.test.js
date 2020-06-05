import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;
//const { getExampleChargeData } = require("./services/dataHandler");
chai.use(chaiHttp);

//ref: https://stackoverflow.com/questions/35697763/post-request-via-chai

describe('Payment API Endpoint Test Group', () => {
  //const ip_address = process.env.IP
  //const port = process.env.PORT
  const ip_address = 'localhost'
  const port = 9403

  const host = "http://" + ip_address + ':' + port;
  const path = "/api/v1/payment/charge";

  it('should send correct cc in body and succeed to : /api/v1/payment/charge POST', (done) => {

    const request_body = getExampleChargeData(2, 2033)

    chai
      .request(host)
      .post(path)
      .set('content-type', 'application/json')
      .send(request_body)
      .end((error, response, body) => {
        if (response) {
          expect(response.status).to.equal(200)
          expect(response.body.status).to.equal('succeeded')
          expect(response.body.confirmation_id).not.to.equal(null)
          expect(response.body.confirmation_id.length).to.equal(32)

          //confirmation_id is random UUID so best we can do is to check it is not null
          // and of len of 32 e.g. 'd5524a140665fa113369d5e94bc122f9'

          done();
        }
      });
  });

  it('should send invalid cc in body and return an `Card expired this year` 400 error to : /api/v1/payment/charge POST', (done) => {

    var request_body = getExampleChargeData(5, 2020)

    chai
      .request(host)
      .post(path)
      .set('content-type', 'application/json')
      .send(request_body)
      .end((error, response, body) => {
        if (response) {
          expect(response.status).to.equal(400)
          expect(response.body.error).to.equal('Card expired this year')
          done();
        }
      });
  });

  it('should send invalid cc in body and return an `Card expired` 400 error to : /api/v1/payment/charge POST', (done) => {

    var request_body = getExampleChargeData(2, 1967)

    chai
      .request(host)
      .post(path)
      .set('content-type', 'application/json')
      .send(request_body)
      .end((error, response, body) => {
        if (response) {
          expect(response.status).to.equal(400)
          expect(response.body.error).to.equal('Card expired')
          done();
        }
      });
  });

});


//D.R.Y. smell ./services/dataHandler has same fxn but async await promise mismatch not solved in it()
function getExampleChargeData(exp_month, exp_year) {
  return {
    invoice: 'invoice_73BC3',
    statement_descriptor: 'BeeTravels.com/r/73BC3',
    amount: 499.99,
    currency: 'USD',
    status: 'unprocessed',
    billing_details: {
      name: 'John Doe',
      phone: '+1 (415) 777 8888',
      email: null,
      address: {
        line1: '42 Arnold Lane',
        line2: '#747',
        city: 'Madrid',
        postal_code: '76NE',
        state: null,
        country: 'Spain'
      }
    },
    payment_method_details: {
      creditcard_number: "4242 4242 4242 4242",
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: "0017"
    }
  }
}
