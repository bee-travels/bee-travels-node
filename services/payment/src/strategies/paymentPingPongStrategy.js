import crypto from 'crypto'
import CreditCardExpiredError from '../errors/CreditCardExpiredError'

export default class PaymentPingPongStrategy {

    constructor(){}

    async processCreditcardPayment(chargeObject)
    {
        //validation
        var exp_month = chargeObject.payment_method_details.exp_month
        var exp_year = chargeObject.payment_method_details.exp_year
        
        var currentTime = new Date()
        // returns the month (from 0 to 11)
        var currentMonth = currentTime.getMonth() + 1
        // returns the year (four digits)
        var currentYear = currentTime.getFullYear()

        if(exp_year < currentYear){
            throw new CreditCardExpiredError("Card expired")
        }
        if(exp_year == currentYear && exp_month < currentMonth)
        {
            throw new CreditCardExpiredError("Card expired this year")
        }
        const confirmation_id = crypto.randomBytes(16).toString("hex")
        return {status:"succeeded", confirmation_id: confirmation_id}
    }
}