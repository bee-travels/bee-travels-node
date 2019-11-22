/**
 * Router for destination locations
 */

import sendEmail from "../service/emailSender";
import { Router } from "express";

var router = Router();
/* GET list of destination locations */
router.post("/", function (req, res) {
  // Grab the email and body of the person to send message to from the body
  var email = "test@email.com";
  var body = "hello hi";
  var subject = "booking";
  sendEmail(email, subject, body);
  res.send("Done!");
});

export default router;