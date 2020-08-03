import { Router } from "express";
import { processCreditcardPayment } from "./../services/dataHandler";
import CreditCardExpiredError from "./../errors/CreditCardExpiredError";
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(processCreditcardPayment, opossumOptions);

// TODO: fix jaeger and replace context
const context = {};

/**
 * POST /api/v1/payment/charge
 * @summary Payment Service Stub
 * @bodyContent {Charge} application/json
 * @bodyRequired
 * @bodyDescription This is the JSON body required when calling the payment service for Bee Travels
 * @response 200 - Success
 * @response 403 - Invalid query
 * @response 404 - Database not found
 * @response 500 - Internal server error
 */
router.post("/charge", async (req, res, next) => {
  // const context = new Jaeger("charge", req, res);
  const data = req.body;
  try {
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
