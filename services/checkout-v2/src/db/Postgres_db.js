/*
    Postgres DB data access class
*/
import {Pool, Client} from 'pg'
import logger from '../lib/logger'

export default class Postgres_db {

    constructor(usr, pwd,  database_name, host='localhost', port=5432){

        this.database_name = database_name
        this.usr = usr
        this.pwd = pwd
        this.host = host
        this.port = port

        this.driver_name = 'Postgres_db_driver'

        logger.info(`initializing  ${this.driver_name} class to connect to ${this.database_name}`)
        

    }

    async query_async(text, values){

        const pool = new Pool({
            user: this.usr,
            password: this.pwd,
            host: this.host,
            port: this.port,
            database: this.database_name
        })

        try {
            const res = await pool.query(text, values)
            return res.rows
            
          } catch (err) {
            logger.error(err.stack)
          } finally {
              pool.end()
          }
        
    }

    async execute_sql(sql){

        const pool = new Pool({
            user: this.usr,
            password: this.pwd,
            host: this.host,
            port: this.port,
            database: this.database_name
        })

        await pool.query(sql, (err, res) => {
            
            pool.end()

            if (err) {
                     return console.error('Error acquiring client', err.stack)
            } 

            return res
          })


    }

    async execute_sql_client(sql){

        const pool = new Pool({
            user: this.usr,
            password: this.pwd,
            host: this.host,
            port: this.port,
            database: this.database_name
        })

    
        const client = await pool.connect()
        const result = await client.query({
            rowMode: 'array',
            text: sql,
          })

        //await pool.end()
        await client.end()
        

        return result

    }
}