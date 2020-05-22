export default class DB2_db {
    constructor(usr, pwd, database_name){
        this.usr = usr
        this.pwd = pwd
        this.database_name = database_name
        this.driver_name = 'db2_db_driver'
    }

    save(table_name, data_input = {}, PK=null)
    {
        console.log(`${this.driver_name} :: about to save to table ${table_name}`)
    }

    delete(table_name, PK)
    {  
        console.log(`${this.driver_name} :: about to delete from table ${table_name} with PK ${PK}`)
    }
}
