import PaymentPostGresStrategy from './paymentPostgresStrategy'

//test globals
const usr = 'postgres'
const pwd = 'example'
const db_name = 'payment'

describe('postgres strategy test suite', () => {



    it('should instantiate payment_PostGres strategy object', async () => {

      const strategy = new PaymentPostGresStrategy(usr, pwd, db_name)

      expect(strategy.bag).not.toBeNull()
      expect(strategy.bag.db_username).toEqual(usr)
      expect(strategy.bag.db_password).toEqual(pwd)
      expect(strategy.bag.db_name).toEqual(db_name)

    })

    it('should add a user to the tuser table', async () => {
      const strategy = new PaymentPostGresStrategy(usr, pwd, db_name)

      //user variables
      let first_name = 'Gary'
      let last_name = 'Cooper'
      let email = 'gary@cooper.com'
      let country = 'Ghana'
      let address = '45 Penny Lane, Riversdale'
      let creditcard = '1111-2222-3333-4444'
      let cc_expires_month = 6
      let cc_expires_year = 2028
      let cc_cvc = '001'

      const result = await strategy.saveUser(first_name, last_name, email, address, country, creditcard, cc_expires_month, cc_expires_year, cc_cvc)
      expect(result).toBeGreaterThan(0)
    })

    it('should make a hotel reservation', async () => {


      //need a cart with

            //  a user

            // a hotel





    })
})
