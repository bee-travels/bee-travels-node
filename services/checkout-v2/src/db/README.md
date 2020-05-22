# database [abstraction] layer
Usage
1. in client class 

```javascript

import DB2_db from './db/DB2_db.js'
import Postgres_db from './db/Postgres_db'

let db = null;

main(){

    if(process.env.DB_FLAVOR == 'db2')  //db2 datalayer
    {
        db = new DB2_db(process.env.DB_USR, process.env.DB_PASS, process.env.DB_NAME)
    }

    if(process.env.DB_FLAVOR == 'postgres')  //PostgresDB datalayer
    {
        db = new Postgres_db(process.env.DB_USR, process.env.DB_PASS, process.env.DB_NAME)
    }

}

```
2. Then later in the code ( assuming db variable is in scope/global and there is a `widgets entity` in your db) 

```javascript

//save new widget
var ret = db.save('widgets', {widgetName:'dallek_spout', cost: 76.99})
console.log(`saved insert new? with PK ${ret.pk}`)

//upate widget's cost by PK
ret = db.save('widgets', {cost:33.25}, ret.pk)
console.log(`saved update? with PK ${ret.pk}`)
console.log('verify')
console.log(ret)

//delete widget by PK
let wasDeleted = db.delete('widgets', ret.pk)
console.log(`deleted with PK ${ret.pk} returned ${wasDeleted}`)

```
