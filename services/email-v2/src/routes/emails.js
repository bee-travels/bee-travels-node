import { Router } from "express";
import {sendEmail} from "../services/dataHandler";
import EmailError from "../errors/EmailError";

const router = Router();

/**
 * POST /api/v1/emails
 * @description Example route
 * @response 200 - OK
 * @response 400 - Error
 * @operationId sendMail
 * @bodyDescription send email
 * @bodyContent {Email} application/json
 * @bodyRequired
 */
router.post("/", async (req, res, next) => {
  try {
    let email = req.body.email;
    let body = req.body.body;
    let subject = req.body.subject;
    let from = req.body.from;
    const response = await sendEmail(email, from, subject, body);

    return res.json(response);
  } catch (e) {
    if (e instanceof EmailError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
