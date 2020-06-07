import sgMail from "@sendgrid/mail";
import {sendEmail} from './dataHandler';
import { describe, it } from "mocha";
import chai, { expect } from "chai";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("sendEmail", () => {
  it("success sending email", async () => {
    sinon.stub(sgMail, "send").returns('success');
    const to = "test@test.com";
    const from = "test@test.con"
    const body = "test body"
    const subject = "test subject";

    const res = await sendEmail(to, from, subject, body);
    expect(res).to.deep.equal('success');
  });
});

afterEach(() => sinon.restore())