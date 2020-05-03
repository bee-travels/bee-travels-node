import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

describe("bloop", () => {
  it("blop", async () => {
    const expectedCountries = [
      "American Samoa",
      "Bonaire",
      "British Indian Ocean Territory",
      "British Virgin Islands",
      "Caribbean Netherlands",
      "Ecuador",
      "El Salvador",
      "Guam",
      "Marshall Islands",
      "Micronesia",
      "Northern Mariana Islands",
      "Palau",
      "Panama",
      "Puerto Rico",
      "Saba",
      "Sint Eustatius",
      "Timor-Leste",
      "Turks and Caicos Islands",
      "United States of America",
      "US Virgin Islands",
      "Wake Island",
      "Zimbabwe",
    ];

    chai
      .request(app)
      .get("/api/v1/currency/usd")
      .end((_, res) => {
        expect(res.body).to.deep.equal({
          code: "USD",
          currency: "United States dollar",
          countries: expectedCountries,
        });
      });
  });
});
