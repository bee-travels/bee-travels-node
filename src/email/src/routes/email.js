/**
 * Router for destination locations
 */

import sendEmail from "../service/emailSender";
import { Router } from "express";

var router = Router();
/* GET list of destination locations */
router.post("/", async function (req, res) {
  // Grab the email and body of the person to send message to from the body
  var email = req.body.email;
  var body = req.body.body;
  var subject = req.body.subject;
  var from = req.body.from;
  // try {
  //   await sendEmail(email, from, subject, body);
  //   res.status(201).send("OK!");
  //   return;
  // } catch(error) {
  //   // console.log(error);
  //   res.status(500).send("ERROR!");
  //   return;
  // }
  var response = await sendEmail(email, from, subject, body);

  console.log("RESPONSE -- ",response);
  res.status(response).send("Done!");
});

export default router;