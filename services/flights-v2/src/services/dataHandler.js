import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";
import {
  getAirportFromPostgres,
  getAirportsFromPostgres,
  getAirportsListFromPostgres,
  getDirectFlightsFromPostgres,
  getOneStopFlightsFromPostgres,
  getTwoStopFlightsFromPostgres,
  postgresReadinessCheck,
} from "./postgresService";

const capitalize = (text) => {
  if (!text) return text;
  return text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

const upper = (text) => (text ? text.toUpperCase() : text);

export async function getAirports(city, country, code, jaegerTracer) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      jaegerTracer.start("getAirportsFromPostgres");
      data = await getAirportsFromPostgres(
        capitalize(city),
        capitalize(country),
        upper(code),
        jaegerTracer
      );
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getAirportsList(jaegerTracer) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      jaegerTracer.start("getAirportsListFromPostgres");
      data = await getAirportsListFromPostgres(jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getAirport(id, jaegerTracer) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      jaegerTracer.start("getAirportFromPostgres");
      data = await getAirportFromPostgres(id, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getDirectFlights(from, to, jaegerTracer) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      jaegerTracer.start("getDirectFlightsFromPostgres");
      data = await getDirectFlightsFromPostgres(from, to, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getOneStopFlights(from, to, jaegerTracer) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      jaegerTracer.start("getOneStopFlightsFromPostgres");
      data = await getOneStopFlightsFromPostgres(from, to, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getTwoStopFlights(from, to, jaegerTracer) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      jaegerTracer.start("getTwoStopFlightsFromPostgres");
      data = await getTwoStopFlightsFromPostgres(from, to, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function readinessCheck() {
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await postgresReadinessCheck();
    default:
      return false;
  }
}
