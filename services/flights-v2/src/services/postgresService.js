import { Client, types } from "pg";
import { isValidQueryValue } from "query-validator";

types.setTypeParser(1700, (val) => parseFloat(val));

export async function getFlightInfoFromPostgres(filter) {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

  try {
    client.connect();

    const statement = "SELECT DISTINCT " + filter + " from flights";

    const res = await client.query(statement);
    let result = res.rows.map((row) => row.airlines);
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getAirportFromPostgres(id, context) {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

  let query = {
    statement: "id=$1",
    values: [isValidQueryValue(id)],
  };

  try {
    context.start("postgresClientConnect");
    client.connect();
    context.stop();

    const statement = "SELECT * from airports WHERE " + query.statement;

    context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    context.stop();

    return res.rows.length > 0 ? res.rows[0] : {};
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getAirportsFromPostgres(city, country, code, context) {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

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
      statement: "WHERE country=$1 AND city=$2",
      values: [isValidQueryValue(country), isValidQueryValue(city)],
    };
  } else if (city && code) {
    query = {
      statement: "WHERE city=$1 AND iata_code=$2",
      values: [isValidQueryValue(city), isValidQueryValue(code)],
    };
  } else if (country && code) {
    query = {
      statement: "WHERE country=$1 AND iata_code=$2",
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
    context.start("postgresClientConnect");
    client.connect();
    context.stop();

    const statement = "SELECT * from airports " + query.statement;

    context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    context.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getAirportsListFromPostgres(context) {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

  try {
    context.start("postgresClientConnect");
    client.connect();
    context.stop();
    const statement =
      "select distinct city, country from airports where city <> ''";
    context.start("postgresQuery");
    const res = await client.query(statement);
    context.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getDirectFlightsFromPostgres(from, to, context) {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

  let query = {
    statement: "source_airport_id=$1 and destination_airport_id=$2",
    values: [isValidQueryValue(from), isValidQueryValue(to)],
  };
  try {
    context.start("postgresClientConnect");
    client.connect();
    const statement =
      `
    select id       as flight_one_id,
    source_airport_id,
    destination_airport_id,
    flight_duration as time,
    flight_time     as flight_one_time,
    cost,
    airlines
from flights
where ` + query.statement;
    context.stop();
    context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    context.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getOneStopFlightsFromPostgres(from, to, context) {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

  let query = {
    values: [isValidQueryValue(from), isValidQueryValue(to)],
  };

  try {
    context.start("postgresClientConnect");
    client.connect();
    context.stop();
    const statement = `
    select flight1.id                                                                             as flight_one_id,
    flight2.id                                                                                    as flight_two_id,
    flight1.source_airport_id                                                                     as source_airport_id,
    flight1.destination_airport_id                                                                as layover_one_airport_id,
    flight2.destination_airport_id                                                                as destination_airport_id,
    flight1.flight_duration + flight2.flight_duration                                             as flight_time,
    flight1.flight_duration + flight2.flight_time - flight1.flight_time + flight2.flight_duration as time,
    flight1.cost + flight2.cost                                                                   as cost,
    flight1.flight_time                                                                           as flight_one_time,
    flight2.flight_time                                                                           as flight_two_time,
    flight1.airlines                                                                              as airlines
from (select * from flights where source_airport_id = $1) flight1
      inner join (select *
                  from flights
                  where destination_airport_id = $2) flight2
                 on flight1.destination_airport_id = flight2.source_airport_id
where flight1.airlines = flight2.airlines
and flight2.flight_time >= (flight1.flight_time + flight1.flight_duration + 60)
order by time limit 20;
    `;
    context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    context.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function getTwoStopFlightsFromPostgres(from, to, context) {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

  let query = {
    values: [isValidQueryValue(from), isValidQueryValue(to)],
  };

  try {
    context.start("postgresClientConnect");
    client.connect();
    context.stop();
    const statement = `
    select f.id                  as flight_one_id,
    c.flight2id                  as flight_two_id,
    c.flight3id                  as flight_three_id,
    f.source_airport_id          as source_airport_id,
    c.layover_one_airport_id,
    c.layover_two_airport_id,
    c.destination_airport_id_ext as desination_airport_id,
    c.totalTime                  as time,
    c.totalFlightTime as flight_time,
    c.totalCost                  as cost,
    c.flight1time                as flight_one_time,
    c.flight2time                as fligh_two_time,
    c.flight3time                as flight_three_time,
    f.airlines
from flights f,
  lateral flight_two_stop(f.source_airport_id, f.destination_airport_id,
                          $2, f.flight_time, f.flight_duration, f.cost,
                          f.airlines) c
where f.source_airport_id = $1
order by c.totalTime
limit 20;
    `;
    context.start("postgresQuery");
    const res = await client.query(statement, query.values);
    context.stop();
    return res.rows;
  } catch (e) {
    console.log(e);
  } finally {
    client.end();
  }
}

export async function postgresReadinessCheck() {
  let clientSettings = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: "beetravels",
  };

  if (process.env.DATABASE_CERT) {
    clientSettings.ssl = {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CERT,
    };
  }

  const client = new Client(clientSettings);

  try {
    await client.connect();
  } catch (err) {
    return false;
  } finally {
    client.end();
  }
  return true;
}
