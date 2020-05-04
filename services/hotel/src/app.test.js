import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

describe("GET /api/v1/hotels/united-states/new-york?hotel=Bronze Estate Hotel", () => {
  it("returns list of hotels", (done) => {
    chai
      .request(app)
      .get("/api/v1/hotels/united-states/new-york?hotel=Bronze Estate Hotel")
      .end((_, res) => {
        expect(res.body).to.deep.equal([
          {
            city: "New York",
            name: "Bronze Estate Hotel",
            country: "United States",
            superchain: "Urban Lifestyle",
            cost: 380,
            images: [
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0193.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0033.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0235.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0174.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0529.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0129.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0437.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0252.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0128.jpg",
            ],
            type: "budget",
          },
        ]);
        done();
      });
  });
});
