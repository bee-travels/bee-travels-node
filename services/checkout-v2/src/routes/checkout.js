import { Router } from "express";
import { processCart } from "../services/dataHandler";

const router = Router();

/**
 * POST /api/v1/checkout/cart:
 * @requestBody {Cart} This is the JSON body required to initiate the Checkout service for Bee Travels
 */
router.post("/cart", async (req, res, next) => {
  const data = req.body;
  try {
    const postProcessCart = await processCart(data);
    return res.json(postProcessCart);
  } catch (e) {
    if (e instanceof CartProcessingError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
