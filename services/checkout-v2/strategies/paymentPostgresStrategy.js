import { v4 as uuidv4 } from 'uuid'
import Postgres_db from '../db/Postgres_db'
import logger from '../lib/logger'

export default class PaymentPostGresStrategy {
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

      const db = new Postgres_db(this.bag.db_username, this.bag.db_password, this.bag.db_name)
      const text = 'INSERT INTO payment.tuser(first_name, last_name, email, usr_uuid,  street, creditcard, cc_expires_month, cc_expires_year, cc_cvc, country, created) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING user_id'
      const values =                         [first_name, last_name, email, usr_uuid, address, creditcard, cc_expires_month, cc_expires_year, cc_cvc, country, created ]
  
      let rez = await db.query_async(text, values)
      pk_user = rez[0].user_id

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

/*


logic that was not covered and under the `button` in first take of this microservice :(
    aka spagetti code with `technical debt`
)



findUserByEmailAndCC( email, creditcard, bag)
{
  // lookup by cc and email Select PK user_id
  const db = new Postgres_db(bag.db_username, bag.db_password, bag.db_name)
  let sql = `SELECT user_id FROM  payment.tuser WHERE email='${email}' AND creditcard='${creditcard}'`
  let rez = await db.execute_sql_client(sql)
  return rez.rows[0]
}



makeHotelBooking(data)
{
  let pk_user = saveUser()

  //ok wow
  if(pk_user !== -1)   
  {
    const confirmation_uuid = uuidv4()
    logger.warn(`PK of this user is ${pk_user} and we will use GUID as ${confirmation_uuid}`)
    //we are ready to insert into reservation table


    const reservation_id = saveReservation(usr_uuid, confirmation_uuid, created, bag)
    result.push("reservation int")
    result.push(reservation_id)

    hotel.city = data.city
    hotel.name = data.name
    hotel.superchain = data.superchain
    hotel.country = data.country
    hotel.type = data.__type__
    hotel.cost = data.cost
    hotel.cost_currency_code = data.cost_currency_code

    const hotel_id = saveHotel(usr_uuid, confirmation_uuid, created,hotel, bag)

    //insert hotel ( cart items tbd in list :)        result.push("inz tbd")
  }

  //   end refactor   --->

}

saveHotel(usr_uuid, confirmation_uuid, created, hotel, bag)
{
  const text  = `INSERT INTO payment.thotel (usr_uuid, confirmation_uuid, name, superchain, type, country, cost, cost_currency_code, created_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING hotel_id`
  const values = [usr_uuid, confirmation_uuid, hotel.name, hotel.superchain, hotel.type, hotel.country, hotel.cost, hotel.cost_currency_code, created]
  try {
    const db = new Postgres_db(bag.db_username, bag.db_password, bag.db_name)
    let rez = await db.query_async(text, values)
    logger.warn(rez)
    
    
  }
  catch(dbcex){
    logger.error(dbcex)
  }
}

saveReservation(usr_uuid, confirmation_uuid, created, bag)
{
  const text  = `INSERT INTO payment.treservation (usr_uuid, confirmation_uuid, created_on) VALUES($1, $2, $3) RETURNING reservation_id`
  const values = [usr_uuid, confirmation_uuid, created]
  try {
    const db = new Postgres_db(bag.db_username, bag.db_password, bag.db_name)
    let rez = await db.query_async(text, values)
    logger.warn(rez)
    
    
  }
  catch(dbcex){
    logger.error(dbcex)
  }
}


*/
