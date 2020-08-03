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

export function buildCarPostgresQuery(country, city, filters) {
  const { company, car, type, style, minCost, maxCost } = filters;
  let query = {
    statement: "country=$1 and city=$2",
    values: [isValidQueryValue(country), isValidQueryValue(city)],
  };
  if (company) {
    for (let index = 0; index < company.length; index++) {
      query.values.push(isValidQueryValue(company[index]));
      if (index === 0) {
        query.statement =
          query.statement + " and (rental_company=$" + query.values.length;
      } else {
        query.statement =
          query.statement + " or rental_company=$" + query.values.length;
      }
      if (index === company.length - 1) {
        query.statement = query.statement + ")";
      }
    }
  }
  if (car) {
    for (let index = 0; index < car.length; index++) {
      query.values.push(isValidQueryValue(car[index]));
      if (index === 0) {
        query.statement =
          query.statement + " and (name=$" + query.values.length;
      } else {
        query.statement = query.statement + " or name=$" + query.values.length;
      }
      if (index === car.length - 1) {
        query.statement = query.statement + ")";
      }
    }
  }
  if (type) {
    for (let index = 0; index < type.length; index++) {
      query.values.push(isValidQueryValue(type[index]));
      if (index === 0) {
        query.statement =
          query.statement + " and (body_type=$" + query.values.length;
      } else {
        query.statement =
          query.statement + " or body_type=$" + query.values.length;
      }
      if (index === type.length - 1) {
        query.statement = query.statement + ")";
      }
    }
  }
  if (style) {
    for (let index = 0; index < style.length; index++) {
      query.values.push(isValidQueryValue(style[index]));
      if (index === 0) {
        query.statement =
          query.statement + " and (style=$" + query.values.length;
      } else {
        query.statement = query.statement + " or style=$" + query.values.length;
      }
      if (index === style.length - 1) {
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

export async function getCarDataFromPostgres(query, context) {
  // let clientSettings = {
  //   host: process.env.PG_HOST,
  //   port: process.env.PG_PORT,
  //   user: process.env.PG_USER,
  //   password: process.env.PG_PASSWORD,
  //   database: "beetravels",
  // };

  // if (process.env.DATABASE_CERT) {
  //   clientSettings.ssl = {
  //     rejectUnauthorized: false,
  //     ca: process.env.DATABASE_CERT,
  //   };
  // }

  // const client = new Client(clientSettings);
  let client = null;

  try {
    // context.start("postgresClientConnect");
    client = await pool.connect();
    // context.stop();

    const statement =
      "SELECT cars.id, cars.car_id, cars.city, cars.country, cars.rental_company, cars.cost, car_info.name, car_info.body_type, car_info.style, car_info.image FROM cars INNER JOIN car_info ON cars.car_id = car_info.id WHERE " +
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

export async function getCarInfoFromPostgres(filterType, context) {
  // const client = new Client({
  //   host: process.env.PG_HOST,
  //   user: process.env.PG_USER,
  //   password: process.env.PG_PASSWORD,
  //   database: "beetravels",
  // });
  let client = null;

  try {
    // context.start("postgresClientConnect");
    client = await pool.connect();
    // context.stop();

    const table = filterType === "rental_company" ? "cars" : "car_info";
    // context.start("postgresQuery");
    const res = await client.query(
      "SELECT DISTINCT " + filterType + " FROM " + table
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
  // let clientSettings = {
  //   host: process.env.PG_HOST,
  //   port: process.env.PG_PORT,
  //   user: process.env.PG_USER,
  //   password: process.env.PG_PASSWORD,
  //   database: "beetravels",
  // };

  // if (process.env.DATABASE_CERT) {
  //   clientSettings.ssl = {
  //     rejectUnauthorized: false,
  //     ca: process.env.DATABASE_CERT,
  //   };
  // }

  // const client = new Client(clientSettings);

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
