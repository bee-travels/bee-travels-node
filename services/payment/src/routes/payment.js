import { Router } from "express";
import { processCreditcardPayment } from "../services/dataHandler";
import CreditCardExpiredError from '../errors/CreditCardExpiredError'

const router = Router();

/**
 * @swagger
 * /payment/charge:
 *   post:
 *     tags:
 *       - Payment
 *     summary: charge a customer
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: Payment data needed to charge customers of Bee Travels
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Charge'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid credit card
 *       405:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post(
  '/charge', async (req, res, next) => {

    const data = req.body

    try {
      const rez = await processCreditcardPayment(data)
      return res.json(rez)

    } catch (e) {
      if (e instanceof CreditCardExpiredError) {
        return res.status(400).json({ error: e.message });
      }
      next(e);
    }
  }
)

export default router;
