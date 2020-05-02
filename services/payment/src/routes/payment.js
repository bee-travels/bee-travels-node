import { Router } from 'express'
import asyncMiddleware from '../middlewares/asyncMiddleware'
import {getPaymentStrategy} from '../strategies/paymentStrategyManager'
// import logger from '../lib/logger'

var router = Router()

router.post(
  '/charge',
  asyncMiddleware(async (req, res) => {

      const data = req.body
      const defaultPaymentProvider = 'PINGPONG'
      var paymentProvider = defaultPaymentProvider

      if(process.env.PAYMENT_PROVIDER) {
        paymentProvider = process.env.PAYMENT_PROVIDER
      }

      const paymentStrategy = await getPaymentStrategy(paymentProvider)

      return res.json(paymentStrategy.processCreditcardPayment(data))
    }
  )
)

export default router;
