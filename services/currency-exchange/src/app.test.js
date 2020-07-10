import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

// describe("GET /api/v1/currency/:code", () => {
//   it("returns metadata given a valid code", (done) => {
//     chai
//       .request(app)
//       .get("/api/v1/currency/zar")
//       .end((_, res) => {
//         expect(res.body).to.deep.equal({
//           code: "ZAR",
//           currency: "South African rand",
//           countries: ["South Africa"],
//         });
//         done();
//       });
//   });
// });
