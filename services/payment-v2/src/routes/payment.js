import { Router } from "express";
import { processCreditcardPayment } from "../services/dataHandler";
import CreditCardExpiredError from "../errors/CreditCardExpiredError";
import Jaeger from "../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

/**
 * POST /api/v1/payment/charge
 * @requestBody {Charge} This is the JSON body required when calling the payment service for Bee Travels
 */
router.post("/charge", async (req, res, next) => {
  const context = new Jaeger("charge", req, res);
  const data = req.body;
  try {
    const breaker = new CircuitBreaker(
      processCreditcardPayment,
      opossumOptions
    );
    const postProcCCresult = await breaker.fire(data);
    return res.json(postProcCCresult);
  } catch (e) {
    if (e instanceof CreditCardExpiredError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
