import { Router } from "express";
import { sendEmail } from "../services/dataHandler";
import EmailError from "../errors/EmailError";
import { format } from "prettier";

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
    var email = req.body.email;
    var body = req.body.body;
    var subject = req.body.subject;
    var from = req.body.from;
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
