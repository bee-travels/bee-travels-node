import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { IllegalDatabaseQueryError } from "query-validator";

// Breaks code coverage if using import x from "x"
const { buildCarMongoQuery } = require("./mongoService");
// const IllegalDatabaseQueryError = require("./../errors/IllegalDatabaseQueryError");

chai.use(chaiAsPromised);

describe("buildCarMongoQuery", () => {
  it("returns car query for mongo", async () => {
    const data = buildCarMongoQuery("United States", "New York", {
      company: undefined,
      car: ["Toyota Camry"],
      type: undefined,
      style: undefined,
      minCost: 100,
      maxCost: 300,
    });

    expect(data).to.deep.equal({
      country: "United States",
      city: "New York",
      name: { $in: ["Toyota Camry"] },
      cost: { $gte: 100, $lte: 300 },
    });
  });

  // TODO: fixme
  // it("throws IllegalDatabaseQueryError for query injection", function () {
  //   expect(
  //     buildCarMongoQuery("United States", "New York", {
  //       company: undefined,
  //       car: ["Toyota Camry", '{"$gt": ""}'],
  //       type: undefined,
  //       style: undefined,
  //       minCost: 100,
  //       maxCost: 300,
  //     })
  //   ).to.throw(IllegalDatabaseQueryError);
  // });
});
