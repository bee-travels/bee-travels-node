import { Router } from "express";
import { processCheckout } from "../services/dataHandler";
import CheckoutProcessingError from "../errors/CheckoutProcessingError"
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 10 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

/**
 * POST /api/v1/checkout/cart
 * @summary Checkout a Bee Travels cart
 * @bodyContent {Cart} application/json
 * @bodyRequired
 * @bodyDescription This is the JSON body required to initiate the Checkout service for Bee Travels
 * @response 200 - Success
 * @response 403 - Invalid query
 * @response 404 - Database not found
 * @response 500 - Internal server error
 */
router.post("/cart", async (req, res, next) => {
  const context = new Jaeger("checkout", req, res);
  const cartData = req.body;
  try {
    const breaker = new CircuitBreaker(processCheckout, opossumOptions);
    const data = await breaker.fire(context, cartData);
    return res.json(data);
  } catch (e) {
    if (e instanceof CheckoutProcessingError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
