import { Router } from "express";
import { processCreditcardPayment } from "../services/dataHandler";
import CreditCardExpiredError from '../errors/CreditCardExpiredError'

const router = Router();

/**
 * @swagger
 * /api/v1/payment/charge:
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
 * definitions:
 *  Charge:
 *    type: object
 *    properties:
 *      invoice:
 *        type: string
 *        example: "invoice_73BC3"
 *      statement_descriptor:
 *        type: string
 *        minLength: 1
 *        maxLength: 22
 *        example: "BeeTravels.com/r/73BC3"
 *      amount:
 *        type: number
 *        format: decimal
 *        example: 499.99
 *      currency:
 *        type: string
 *        description: "Three-letter ISO currency code, in lowercase. Must be a supported currency."
 *        example: "USD"
 *      status:
 *        type: string
 *        example: unprocessed
 *      billing_details :
 *        type: object
 *        $ref: '#/definitions/BillingDetails'
 *      payment_method_details:
 *        type: object
 *        $ref: '#/definitions/Card'
 *
 *
 *  BillingDetails  :
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *        example: John Doe
 *      phone:
 *          type: string
 *          example: "+1 (415) 777 8888"
 *      email:
 *          type: string
 *          example: null
 *      address :
 *        type: object
 *        $ref: '#/definitions/Address'
 *
 *  Address:
 *    type: object
 *    properties:
 *      line1:
 *        type: string
 *        example: 42 Arnold Lane
 *      line2:
 *        type: string
 *        example: "#747"
 *      city:
 *        type: string
 *        example: Madrid
 *      postal_code:
 *        type: string
 *        example: 76NE
 *      state:
 *        type: string
 *        example: null
 *      country:
 *        type: string
 *        example: Spain
 *
 *  Card:
 *    type: object
 *    properties:
 *      creditcard_number:
 *        type: string
 *        example: "4242 4242 4242 4242"
 *      exp_month:
 *        type: integer
 *        format: int32
 *        minimum: 1
 *        maximum: 12
 *        example: 2
 *      exp_year:
 *        type: integer
 *        format: int32
 *        example: 2023
 *      cvc:
 *        type: string
 *        example: "0017"
 */
router.post(
  '/charge', async (req, res, next) => {

    const data = req.body
    console.log(req.body)
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
