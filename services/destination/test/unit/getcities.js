import { getDestinationData } from "../../src/services/dataHandler";
import { describe, it } from "mocha";
import { assert } from "chai";

describe("Get all destination", () => {
  it("should return all destinations", (done) => {
    const destinationData = getDestinationData(null);
    destinationData
      .then((data) => {
        assert(
          data.cities !== null,
          "Data should have a field called 'cities'"
        );
        assert(data.cities.length > 0, "There should be data here");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("Get a specific city", () => {
  it("should return a city", (done) => {
    const destinationData = getDestinationData("New York", "United States");
    destinationData
      .then((data) => {
        assert(data.city === "New York", "City should be New York");
        assert(
          data.country === "United States",
          "Country should be United States"
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
