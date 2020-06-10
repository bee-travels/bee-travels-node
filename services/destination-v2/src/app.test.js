import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

// TODO: fixme
// describe("GET /api/v1/destinations", () => {
//   it("returns list of cities", (done) => {
//     chai
//       .request(app)
//       .get("/api/v1/destinations")
//       .end((_, res) => {
//         expect(res.body).to.have.lengthOf(182);
//         done();
//       });
//   });
// });
