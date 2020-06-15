import { Router } from "express";
import { processCheckout } from "../services/dataHandler";
import CheckoutProcessingError from "../errors/CheckoutProcessingError"
const router = Router();

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
  const data = req.body;
  try {
    const postProcessCheckout = await processCheckout(data);
    return res.json(postProcessCheckout);
  } catch (e) {
    if (e instanceof CheckoutProcessingError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
