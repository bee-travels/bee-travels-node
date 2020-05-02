import { v4 as uuidv4 } from 'uuid'

export default class PaymentPingPongStrategy {

    constructor(){}

    processCreditcardPayment(chargeObject)
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
            return {status:"card_expired", confirmation_id: null}
        }
        if(exp_year == currentYear && exp_month < currentMonth)
        {
            return {status:"card_expired", confirmation_id: null}
        }
        
        return {status:"succeeded", confirmation_id: uuidv4()}
    }
}