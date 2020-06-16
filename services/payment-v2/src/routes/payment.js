import { Router } from "express";
import { processCreditcardPayment } from "../services/dataHandler";
import CreditCardExpiredError from "../errors/CreditCardExpiredError";

const router = Router();


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
  const data = req.body;
  try {
    const postProcCCresult = await processCreditcardPayment(data);
    return res.json(postProcCCresult);
  } catch (e) {
    if (e instanceof CreditCardExpiredError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
