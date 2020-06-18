# db2 CE instructions

## running db2 locally in Docker
```sh

DB2INSTANCE=db2inst1

#run container
docker run -itd --restart always --name checkoutdb2 --privileged=true -p 50000:50000 -e LICENSE=accept -e DB2INSTANCE="${DB2INSTANCE}" -e DB2INST1_PASSWORD=admin -e DBNAME=checkout -v /Users/Grant.Steinfeld@ibm.com/db2 ibmcom/db2

#shell in to run db2 cli to execute sql statements
docker exec -ti checkoutdb2 bash -c "su - ${DB2INSTANCE}"


```
### once shelled in you can run db2 commands

first create a database called checkout
```sh
db2 CREATE DATABASE checkout;
db2 connect to checkout

vi create-checkout-db-db2.sql

#paste in sql from this file from your local file system simarly called create-checkout-db-db2.sql

#save and exit vi

#then run this command to run scripts

db2 -tvmf checkout.sql

```

### Resources
https://hub.docker.com/r/ibmcom/db2

