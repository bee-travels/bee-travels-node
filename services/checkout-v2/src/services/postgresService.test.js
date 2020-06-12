import Postgres_db from './Postgres_db'
import logger from '../lib/logger'
import { v4 as uuidv4 } from 'uuid'

describe('postgres db layer plumbing', () => {

    beforeAll( () => console.log("before all"))

    afterAll( async () => {

      console.log("After All db tests ran, clean out db")
      let db_username = 'postgres'
      let db_password = 'example'
      let db_name = 'payment'

      try {
        const db = new Postgres_db(db_username, db_password, db_name)
        await db.query_async('DELETE FROM payment.tuser WHERE last_name=$1;',['Channel'])
        await db.query_async('DELETE FROM payment.tuser WHERE last_name=$1;',['Royster'])
        await db.query_async('DELETE FROM payment.tuser WHERE last_name=$1;',['Cooper'])
        
        

      }
      catch(dbcex){
        logger.error(dbcex)
      }
    })

    it('should instantiate PostgresDB object', async () => {
      const db = new Postgres_db()
      expect(db).not.toBeNull()
    });

    it('should insert data into tuser table in the payment database', async () => {
      let db_username = 'postgres'
      let db_password = 'example'
      let db_name = 'payment'
      let email = 'mroyster@royster.com'
      let country = 'Japan'
      const usr_uuid = uuidv4()

      try {
        const db = new Postgres_db(db_username, db_password, db_name)
        let sql = `INSERT INTO payment.tuser (first_name, last_name, email, usr_uuid,  
          street, creditcard, cc_expires_month, cc_expires_year, cc_cvc, country, created) 
          VALUES ('Mary', 'Royster', '${email}','${usr_uuid}', '42 Canary Ranch Road','1111-2222-3333-4444',6, 2028, 5677, 
          '${country}', '01/29/2018' )`

        let rez = await db.execute_sql(sql)
        logger.warn(rez)
        expect(rez).not.toBeNull()
      }
      catch(dbcex){
        logger.error(dbcex)
      }
    });

    it('should use query to insert data into tuser table in the payment database', async () => {
      let db_username = 'postgres'
      let db_password = 'example'
      let db_name = 'payment'
      let email = 'twirl@uct.edu'
      let country = 'South Africa'
      const usr_uuid = uuidv4()

      const text = 'INSERT INTO payment.tuser(first_name, last_name, email, usr_uuid,  street, creditcard, cc_expires_month, cc_expires_year, cc_cvc, country, created) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *'
      const values = ['Coco', 'Channel', email, usr_uuid, '10 Cherry Ln', '1111-2222-3333-4444', 12, 2023, 1212, country, '01/29/2018' ]
      try {
        const db = new Postgres_db(db_username, db_password, db_name)
        let rez = await db.query_async(text, values)
        logger.warn("result set")
        logger.warn(rez)
        expect(rez).not.toBeNull()
      }
      catch(dbcex){
        logger.error(dbcex)
      }
    });


    it('read data from the tuser table in the payment database', async () => {
      let db_username = 'postgres'
      let db_password = 'example'
      let db_name = 'payment'
      

      try {
        const db = new Postgres_db(db_username, db_password, db_name)
        let sql = `SELECT email FROM payment.tuser WHERE last_name='Channel';`
        let rez = await db.execute_sql_client(sql)
        
        //logger.warn(rez)
        expect(rez).not.toBeNull()
        expect(rez.rowCount).toEqual(1)
        expect(rez.rows).toEqual([['twirl@uct.edu']])
      }
      catch(dbcex){
        logger.error(dbcex)
      }
    });

    it('should make a hotel reservation', async () => {
      let db_username = 'postgres'
      let db_password = 'example'
      let db_name = 'payment'
      let first_name = 'Gary'
      let last_name = 'Cooper'
      let email = 'gary@cooper.com'
      let country = 'Ghana'
      let address = '45 Penny Lane, Riversdale'
      let creditcard = '1111-2222-3333-4444'
      let cc_expires_month = 6
      let cc_expires_year = 2028
      let cc_cvc = '001'
      const usr_uuid = uuidv4()

      try {
        const db = new Postgres_db(db_username, db_password, db_name)
        let sql = `INSERT INTO payment.tuser (first_name, last_name, email, usr_uuid,  
          street, creditcard, cc_expires_month, cc_expires_year, cc_cvc, country, created) 
          VALUES ('${first_name}', '${last_name}', '${email}','${usr_uuid}', '${address}','${creditcard}',${cc_expires_month}, ${cc_expires_year},'${cc_cvc}', 
          '${country}', '01/29/2018' )`

        let rez = await db.execute_sql(sql)
        logger.warn(rez)
        expect(rez).not.toBeNull()


      }
      catch(dbcex){
        logger.error(dbcex)
      }
    });




  });



