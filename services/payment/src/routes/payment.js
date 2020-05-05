import { Router } from 'express'
import {getPaymentStrategy} from '../strategies/paymentStrategyManager'
import CreditCardExpiredError from '../errors/CreditCardExpiredError'


var router = Router()

router.post(
  '/charge', async (req, res, next) => {

      const data = req.body
      const defaultPaymentProvider = 'PINGPONG'
      var paymentProvider = defaultPaymentProvider

      if(process.env.PAYMENT_PROVIDER) {
        paymentProvider = process.env.PAYMENT_PROVIDER
      }
      try {
        const paymentStrategy = await getPaymentStrategy(paymentProvider)
        const rez = await paymentStrategy.processCreditcardPayment(data)
        return res.json(rez)

      } catch (e){
        if (e instanceof CreditCardExpiredError) {
          return res.status(400).json({ error: e.message });
        }
        next(e);
      }
    }
  )


export default router;
