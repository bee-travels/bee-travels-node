import { Router } from "express";
import { processCreditcardPayment } from "../services/dataHandler";
import CreditCardExpiredError from "../errors/CreditCardExpiredError";

const router = Router();

/**
 * POST /api/v1/payment/charge
 * @requestBody {Charge} This is the JSON body required when calling the payment service for Bee Travels
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
