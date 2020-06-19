import { isValidQueryValue } from "query-validator";
import { Client, types } from "pg";

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

export async function getCarDataFromPostgres(query, jaegerTracer) {
  const client = new Client({
    host: process.env.CAR_PG_HOST,
    user: process.env.CAR_PG_USER,
    password: process.env.CAR_PG_PASSWORD,
    database: "beetravels",
  });

  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();

    const statement =
      "SELECT cars.id, cars.car_id, cars.city, cars.country, cars.rental_company, cars.cost, car_info.name, car_info.body_type, car_info.style, car_info.image FROM cars INNER JOIN car_info ON cars.car_id = car_info.id WHERE " +
      query.statement;
    jaegerTracer.start("postgresQuery");
    const res = await client.query(statement, query.values);
    jaegerTracer.stop();
    return res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}

export async function getCarInfoFromPostgres(filterType, jaegerTracer) {
  const client = new Client({
    host: process.env.CAR_PG_HOST,
    user: process.env.CAR_PG_USER,
    password: process.env.CAR_PG_PASSWORD,
    database: "beetravels",
  });

  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();

    const table = filterType === "rental_company" ? "cars" : "car_info";
    jaegerTracer.start("postgresQuery");
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
    jaegerTracer.stop();
    return result;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}

export async function postgresReadinessCheck() {
  const client = new Client({
    host: process.env.CAR_PG_HOST,
    user: process.env.CAR_PG_USER,
    password: process.env.CAR_PG_PASSWORD,
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
