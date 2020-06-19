import sgMail from "@sendgrid/mail";
import { describe, it } from "mocha";
import chai, { expect } from "chai";
import sinon from "sinon";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

describe("POST /", () => {
  it("should return 200 on send mail", (done) => {
    sinon.stub(sgMail, "send").returns("success");
    chai
      .request(app)
      .post("/api/v1/emails")
      .end((_, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should return 400 on email error", (done) => {
    sinon.stub(sgMail, "send").throws();
    chai
      .request(app)
      .post("/api/v1/emails")
      .end((_, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe("Testing 404 /", () => {
  it("should return 404 on random path", (done) => {
    chai
      .request(app)
      .post("/random")
      .end((_, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});

afterEach(() => sinon.restore());
