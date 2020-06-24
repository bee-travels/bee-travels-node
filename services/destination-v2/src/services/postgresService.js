import { isValidQueryValue } from "query-validator";
import { Client, types } from "pg";

types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

export function buildDestinationPostgresQuery(country, city) {
  let query = {
    statement: " WHERE country=$1",
    values: [isValidQueryValue(country)],
  };
  if (city) {
    query.values.push(isValidQueryValue(city));
    query.statement = query.statement + " and city=$2";
  }
  return query;
}

export async function getDestinationDataFromPostgres(query, context) {
  const client = new Client({
    host: process.env.DESTINATION_PG_HOST,
    user: process.env.DESTINATION_PG_USER,
    password: process.env.DESTINATION_PG_PASSWORD,
    database: "beetravels",
  });

  try {
    context.start("postgresClientConnect");
    client.connect();
    context.stop();

    const select = query.values.length === 2 ? "*" : "country, city";
    const statement =
      "SELECT " + select + " FROM destination" + query.statement;
    context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    context.stop();
    return query.values.length === 2 ? res.rows[0] : res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}

export async function postgresReadinessCheck() {
  const client = new Client({
    host: process.env.DESTINATION_PG_HOST,
    user: process.env.DESTINATION_PG_USER,
    password: process.env.DESTINATION_PG_PASSWORD,
  });

  try {
    await client.connect();
  } catch (err) {
    return false;
  } finally {
    client.end();
  }
  return true;
}
