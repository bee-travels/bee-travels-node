import { isValidQueryValue } from "query-validator";
import { types, Pool } from "pg";

const poolConfig = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: "beetravels",
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000,
};

if (process.env.DATABASE_CERT) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
    ca: process.env.DATABASE_CERT,
  };
}

const pool = new Pool(poolConfig);

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
  let client = null;

  try {
    // context.start("postgresClientConnect");
    client = await pool.connect();
    // context.stop();

    const select = query.values.length === 2 ? "*" : "country, city";
    const statement =
      "SELECT " + select + " FROM destination" + query.statement;
    // context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    // context.stop();
    return query.values.length === 2 ? res.rows[0] : res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

export async function postgresReadinessCheck() {
  let client = null;

  try {
    client = await pool.connect();
  } catch (err) {
    return false;
  } finally {
    client.release();
  }
  return true;
}
