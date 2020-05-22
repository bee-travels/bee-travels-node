import { v4 as uuidv4 } from 'uuid'
import Postgres_db from '../db/DB2_db'
import logger from '../lib/logger'

export default class PaymentDB2Strategy {
  constructor(db_username, db_password, db_name) {
    this.bag = this.newBag(db_username, db_password, db_name)
  }

  newBag(db_username, db_password, db_name)
  {
    let bag_ = {};
    bag_.db_username = db_username
    bag_.db_password = db_password
    bag_.db_name = db_name
    return bag_
  }

  async saveUser(first_name, last_name, email, address, country, creditcard, cc_expires_month, cc_expires_year, cc_cvc)
  {
    //save new or update existing user
    logger.info(`about to save user NAMED: ${first_name} ${last_name} ADDRESS: ${address} ${country}`)
  
  
    var pk_user = -1

    try {
      const usr_uuid = uuidv4()
      let created = '03/02/1967'

      // const db = new Postgres_db(this.bag.db_username, this.bag.db_password, this.bag.db_name)
      // const text = 'INSERT INTO payment.tuser(first_name, last_name, email, usr_uuid,  street, creditcard, cc_expires_month, cc_expires_year, cc_cvc, country, created) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING user_id'
      // //select @@identity
      // const values =                         [first_name, last_name, email, usr_uuid, address, creditcard, cc_expires_month, cc_expires_year, cc_cvc, country, created ]
  
      // let rez = await db.query_async(text, values)
      // pk_user = rez[0].user_id

    }
    catch(dbcex)
    {
      logger.warn(Object.getOwnPropertyNames(dbcex))
      logger.warn(dbcex.message)
      if(dbcex.code === '23505')
      {
        pk_user = -222 
        //findUserByEmailAndCC(data.bookeruser[0].email, data.bookeruser[0].creditcard, bag)
      }
    }
    finally
    {
      return pk_user
    }

  }
}