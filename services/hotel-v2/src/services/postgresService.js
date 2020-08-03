import { isValidQueryValue } from "query-validator";
import { Client, types, Pool } from "pg";

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

export function buildHotelPostgresQuery(country, city, filters) {
  const { superchain, hotel, type, minCost, maxCost } = filters;
  let query = {
    statement: "country=$1 and city=$2",
    values: [isValidQueryValue(country), isValidQueryValue(city)],
  };
  if (superchain) {
    for (let index = 0; index < superchain.length; index++) {
      query.values.push(isValidQueryValue(superchain[index]));
      if (index === 0) {
        query.statement =
          query.statement + " and (superchain=$" + query.values.length;
      } else {
        query.statement =
          query.statement + " or superchain=$" + query.values.length;
      }
      if (index === superchain.length - 1) {
        query.statement = query.statement + ")";
      }
    }
  }
  if (hotel) {
    for (let index = 0; index < hotel.length; index++) {
      query.values.push(isValidQueryValue(hotel[index]));
      if (index === 0) {
        query.statement =
          query.statement + " and (name=$" + query.values.length;
      } else {
        query.statement = query.statement + " or name=$" + query.values.length;
      }
      if (index === hotel.length - 1) {
        query.statement = query.statement + ")";
      }
    }
  }
  if (type) {
    for (let index = 0; index < type.length; index++) {
      query.values.push(isValidQueryValue(type[index]));
      if (index === 0) {
        query.statement =
          query.statement + " and (type=$" + query.values.length;
      } else {
        query.statement = query.statement + " or type=$" + query.values.length;
      }
      if (index === type.length - 1) {
        query.statement = query.statement + ")";
      }
    }
  }
  if (minCost) {
    query.values.push(isValidQueryValue(minCost));
    query.statement = query.statement + " and cost>=$" + query.values.length;
  }
  if (maxCost) {
    query.values.push(isValidQueryValue(maxCost));
    query.statement = query.statement + " and cost<=$" + query.values.length;
  }
  return query;
}

export async function getHotelDataFromPostgres(query, context) {
  let client = null;

  try {
    // context.start("postgresClientConnect");
    client = await pool.connect();
    // context.stop();

    const statement =
      "SELECT hotels.id, hotels.hotel_id, hotels.city, hotels.country, hotels.cost, hotels.images, hotels.tags, hotel_info.superchain, hotel_info.type, hotel_info.name FROM hotels INNER JOIN hotel_info ON hotels.hotel_id = hotel_info.id WHERE " +
      query.statement;
    // context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    // context.stop();
    return res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
}

export async function getHotelInfoFromPostgres(filterType, context) {
  let client = null;

  try {
    // context.start("postgresClientConnect");
    client = await pool.connect();
    // context.stop();

    // context.start("postgresQuery");
    const res = await client.query(
      "SELECT DISTINCT " + filterType + " FROM hotel_info"
    );
    let result = [];
    for (let filter = 0; filter < res.rows.length; filter++) {
      Object.keys(res.rows[filter]).forEach(function (key) {
        let temp = res.rows[filter][key];
        if (!result.includes(temp)) {
          result.push(temp);
        }
      });
    }
    // context.stop();
    return result;
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
