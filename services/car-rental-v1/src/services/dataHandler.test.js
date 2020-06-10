import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import TagNodeFoundError from "../errors/TagNotFoundError";
// Breaks code coverage if using import x from "x"
const { getData } = require("./dataHandler");

chai.use(chaiAsPromised);

describe("getData", () => {
  // TODO: fixme
  // it("works", async () => {
  //   const data = await getData();
  //   expect(data).to.deep.equal('success');
  // });
  // TODO: fixme
  // it("throws", async () => {
  //   await expect(getData()).to.eventually.be.rejectedWith(
  //     TagNodeFoundError
  //   );
  // });
});
