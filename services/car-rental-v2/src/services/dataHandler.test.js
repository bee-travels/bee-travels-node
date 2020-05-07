import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

// Breaks code coverage if using import x from "x"
const { getData } = require("./dataHandler");
const ExampleError = require("./../errors/ExampleError");

chai.use(chaiAsPromised);

describe("getData", () => {
  it("works", async () => {
    const data = await getData();

    expect(data).to.deep.equal('success');
  });

  it("throws", async () => {
    await expect(getData()).to.eventually.be.rejectedWith(
      ExampleError
    );
  });
});
