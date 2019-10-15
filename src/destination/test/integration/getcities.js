import { getDestinationData } from "../../src/services/dataHandler";
import { describe, it } from "mocha";
import { assert } from "chai";

describe("Get all destination", () => {
  it("should return all destinations", function(done) {
    var destinationData = getDestinationData(null);
    destinationData.then(function(data) {
      assert(data.cities.length, 5000);
    }).catch(function (err) {
      done(err);
    });
  });
});
