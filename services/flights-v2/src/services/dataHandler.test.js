import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

// describe("getData", () => {
//   it("works", async () => {
//     const data = await getData();

//     expect(data).to.deep.equal('success');
//   });

//   it("throws", async () => {
//     await expect(getData()).to.eventually.be.rejectedWith(
//       ExampleError
//     );
//   });
// });
