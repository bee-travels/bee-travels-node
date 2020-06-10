import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import chaiThings from "chai-things";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;
const TagNotFoundError = require("./errors/TagNotFoundError").default;

chai.use(chaiHttp);
chai.use(chaiThings);
chai.use(chaiAsPromised);

describe("GET /api/v1/cars/info/:tag", () => {
  // TODO: fixme
  // it("returns list of all rental companies", async () => {
  //   const res = await chai
  //     .request(app)
  //     .get("/api/v1/cars/info/rental_company")
  //     .send();
  //   expect(res.body).to.have.members([
  //     "Rent Pad",
  //     "Chakra",
  //     "Carlux",
  //     "Capsule",
  //     "Rentio",
  //   ]);
  // });

  it("throws with a fake tag", async () => {
    const fakeTag = "fake-tag";
    const res = await chai
      .request(app)
      .get(`/api/v1/cars/info/${fakeTag}`)
      .send();
    expect(res.body.error).to.equal(new TagNotFoundError(fakeTag).message);
  });
});

// TODO: fixme
// describe("GET /api/v1/cars/:country/:city", () => {
//   it("returns a list of all cars", async () => {
//     const res = await chai
//       .request(app)
//       .get("/api/v1/cars/united-states/new-york")
//       .send();
//     expect(res.body).to.have.lengthOf(50);
//   });

// TODO: fixme
// it("returns a list of all sedans", async () => {
//   const type = "sedan";
//   const res = await chai
//     .request(app)
//     .get(`/api/v1/cars/united-states/new-york?type=${type}`)
//     .send();
//   expect(res.body).to.all.have.property("body_type", type);
// });

// TODO: Test invalid country
// TODO: Test invalid city
// TODO: Test invalid filters
// });
