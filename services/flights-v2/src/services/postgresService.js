import { Client, types } from "pg";
import { isValidQueryValue } from "query-validator";

types.setTypeParser(1700, (val) => parseFloat(val));

export async function getAirportFromPostgres(id, jaegerTracer) {
  const client = new Client({
    host: process.env.FLIGHTS_PG_HOST,
    user: process.env.FLIGHTS_PG_USER,
    password: process.env.FLIGHTS_PG_PASSWORD,
    database: "beetravels",
  });
  let query = {
    statement: "id=$1",
    values: [isValidQueryValue(id)],
  };

  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();

    const statement = "SELECT * from airports WHERE " + query.statement;

    jaegerTracer.start("postgresQuery");
    const res = await client.query(statement, query.values);
    jaegerTracer.stop();

    return res.rows.length > 0 ? res.rows[0] : {};
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getAirportsFromPostgres(
  city,
  country,
  code,
  jaegerTracer
) {
  const client = new Client({
    host: process.env.FLIGHTS_PG_HOST,
    user: process.env.FLIGHTS_PG_USER,
    password: process.env.FLIGHTS_PG_PASSWORD,
    database: "beetravels",
  });
  let query;
  if (city && country && code) {
    query = {
      statement: "WHERE country=$1, city=$2, iata_code=$3",
      values: [
        isValidQueryValue(country),
        isValidQueryValue(city),
        isValidQueryValue(code),
      ],
    };
  } else if (city && country) {
    query = {
      statement: "WHERE country=$1, city=$2",
      values: [isValidQueryValue(country), isValidQueryValue(city)],
    };
  } else if (city && code) {
    query = {
      statement: "WHERE city=$1, iata_code=$2",
      values: [isValidQueryValue(city), isValidQueryValue(code)],
    };
  } else if (country && code) {
    query = {
      statement: "WHERE country=$1, iata_code=$2",
      values: [isValidQueryValue(country), isValidQueryValue(code)],
    };
  } else if (city) {
    query = {
      statement: "WHERE city=$1",
      values: [isValidQueryValue(city)],
    };
  } else if (country) {
    query = {
      statement: "WHERE country=$1",
      values: [isValidQueryValue(country)],
    };
  } else if (code) {
    query = {
      statement: "WHERE iata_code=$1",
      values: [isValidQueryValue(code)],
    };
  } else {
    query = {
      statement: "",
      values: [],
    };
  }

  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();

    const statement = "SELECT * from airports " + query.statement;

    jaegerTracer.start("postgresQuery");
    const res = await client.query(statement, query.values);
    jaegerTracer.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getAirportsListFromPostgres(jaegerTracer) {
  const client = new Client({
    host: process.env.FLIGHTS_PG_HOST,
    user: process.env.FLIGHTS_PG_USER,
    password: process.env.FLIGHTS_PG_PASSWORD,
    database: "beetravels",
  });
  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();
    const statement =
      "select distinct city, country from airports where city <> ''";
    jaegerTracer.start("postgresQuery");
    const res = await client.query(statement);
    jaegerTracer.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getDirectFlightsFromPostgres(from, to, jaegerTracer) {
  const client = new Client({
    host: process.env.FLIGHTS_PG_HOST,
    user: process.env.FLIGHTS_PG_USER,
    password: process.env.FLIGHTS_PG_PASSWORD,
    database: "beetravels",
  });
  let query = {
    statement: "source_airport_id=$1 and destination_airport_id=$2",
    values: [isValidQueryValue(from), isValidQueryValue(to)],
  };
  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();
    const statement = "select * from flights where " + query.statement;
    jaegerTracer.start("postgresQuery");
    const res = await client.query(statement, query.values);
    jaegerTracer.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getOneStopFlightsFromPostgres(from, to, jaegerTracer) {
  const client = new Client({
    host: process.env.FLIGHTS_PG_HOST,
    user: process.env.FLIGHTS_PG_USER,
    password: process.env.FLIGHTS_PG_PASSWORD,
    database: "beetravels",
  });

  let query = {
    values: [isValidQueryValue(from), isValidQueryValue(to)],
  };

  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();
    const statement = `
    SELECT flight1.id AS flight1id, flight2.id AS flight2id, flight1.source_airport_id
    AS source_airport_id, flight1.destination_airport_id AS layover_airport_id
    , flight2.destination_airport_id AS destination_airport_id, flight1.flight_duration
    + flight2.flight_duration AS totalFlightTime, flight1.flight_duration +
    flight2.flight_time - flight1.flight_time + flight2.flight_duration AS
    totalTime, flight1.cost + flight2.cost AS totalCost, flight1.flight_time AS
    flight1time, flight2.flight_time AS flight2time, flight1.airlines AS
    airlines FROM (SELECT * FROM flights WHERE source_airport_id = $1) flight1 INNER JOIN (SELECT * FROM
    flights WHERE destination_airport_id = $2)
    flight2 ON flight1.destination_airport_id = flight2.source_airport_id WHERE
    flight1.airlines = flight2.airlines AND flight2.flight_time >= ( flight1.flight_time
    + flight1.flight_duration + 60 ) ORDER BY totaltime
    `;
    jaegerTracer.start("postgresQuery");
    const res = await client.query(statement, query.values);
    jaegerTracer.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getTwoStopFlightsFromPostgres(from, to, jaegerTracer) {
  const client = new Client({
    host: process.env.FLIGHTS_PG_HOST,
    user: process.env.FLIGHTS_PG_USER,
    password: process.env.FLIGHTS_PG_PASSWORD,
    database: "beetravels",
  });

  let query = {
    values: [isValidQueryValue(from), isValidQueryValue(to)],
  };

  try {
    jaegerTracer.start("postgresClientConnect");
    client.connect();
    jaegerTracer.stop();
    const statement = `
    SELECT   *
    FROM     flights f,
             lateral flight_two_stop(f.source_airport_id, f.destination_airport_id, $2, f.flight_time, f.flight_duration) c
    WHERE    f.source_airport_id = $1
    ORDER BY c.totaltime limit 20;
    `;
    jaegerTracer.start("postgresQuery");
    const res = await client.query(statement, query.values);
    jaegerTracer.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function postgresReadinessCheck() {
  const client = new Client({
    host: process.env.FLIGHTS_PG_HOST,
    user: process.env.FLIGHTS_PG_USER,
    password: process.env.FLIGHTS_PG_PASSWORD,
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
