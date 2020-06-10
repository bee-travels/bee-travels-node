import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

// Breaks code coverage if using import x from "x"
const app = require("./app").default;

chai.use(chaiHttp);

describe("GET /api/v1/hotels/united-states/los-angeles?superchain=Nimbus%20Elites&hotel=Echo%20Hotel", () => {
  it("returns list of hotels", (done) => {
    chai
      .request(app)
      .get("/api/v1/hotels/united-states/los-angeles?superchain=Nimbus%20Elites&hotel=Echo%20Hotel")
      .end((_, res) => {
        expect(res.body).to.deep.equal([
          {
            city: "Los Angeles",
            name: "Echo Hotel",
            country: "United States",
            superchain: "Nimbus Elites",
            hotel_id: "88958830-7d8c-4f93-b472-196793a05e84",
            cost: 263,
            images: [
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0135.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0329.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0426.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0337.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0306.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0185.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0122.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0380.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0446.jpg",
            ],
            type: "budget",
            id: "5b5358c1-4e67-40f6-b431-39f93dbf5a88",
          },
          {
            city: "Los Angeles",
            name: "Echo Hotel",
            country: "United States",
            superchain: "Nimbus Elites",
            hotel_id: "88958830-7d8c-4f93-b472-196793a05e84",
            cost: 365,
            images: [
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0530.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0299.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0524.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0526.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0175.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0496.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0050.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0410.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0317.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0096.jpg",
            ],
            type: "budget",
            id: "5c635bc3-cfd9-40c2-94a7-0e127e6ca555",
          },
          {
            city: "Los Angeles",
            name: "Echo Hotel",
            country: "United States",
            superchain: "Nimbus Elites",
            hotel_id: "88958830-7d8c-4f93-b472-196793a05e84",
            cost: 373,
            images: [
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0194.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0038.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0368.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0532.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0214.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0152.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0154.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0445.jpg",
              "https://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-hotels/hotel-image-0350.jpg",
            ],
            type: "budget",
            id: "1e59e2ac-950e-422e-9242-8faf0df96785",
          },
        ]);
        done();
      });
  });
});
