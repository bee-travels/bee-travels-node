import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

// TODO: fix this
// describe("GET /", () => {
//   it("an example http test", (done) => {
//     chai
//       .request(app)
//       .get("/")
//       .end((_, res) => {
//         expect(res.body).to.deep.equal('success');
//         done();
//       });
//   });
// });
