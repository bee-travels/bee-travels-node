import { Router } from "express";
import { sendEmail } from "../services/dataHandler";
import EmailError from "../errors/EmailError";
import Jaeger from "../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

/**
 * POST /api/v1/emails
 * @description Send an email to a specific address
 * @response 200 - OK
 * @response 400 - Error
 * @operationId sendMail
 * @bodyDescription send email content
 * @bodyContent {Email} application/json
 * @bodyRequired
 */
router.post("/", async (req, res, next) => {
  const context = new Jaeger("emails", req, res);
  try {
    let email = req.body.email;
    let body = req.body.body;
    let subject = req.body.subject;
    let from = req.body.from;
    const breaker = new CircuitBreaker(sendEmail, opossumOptions);
    const response = await breaker.fire(
      email,
      from,
      subject,
      body,
      context
    );

    return res.json(response);
  } catch (e) {
    if (e instanceof EmailError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
