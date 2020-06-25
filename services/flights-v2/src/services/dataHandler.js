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

export async function getAirports(city, country, code, context) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      context.start("getAirportsFromPostgres");
      data = await getAirportsFromPostgres(
        capitalize(city),
        capitalize(country),
        upper(code),
        context
      );
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getAirportsList(context) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      context.start("getAirportsListFromPostgres");
      data = await getAirportsListFromPostgres(context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getAirport(id, context) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      context.start("getAirportFromPostgres");
      data = await getAirportFromPostgres(id, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getDirectFlights(from, to, context) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      context.start("getDirectFlightsFromPostgres");
      data = await getDirectFlightsFromPostgres(from, to, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getOneStopFlights(from, to, context) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      context.start("getOneStopFlightsFromPostgres");
      data = await getOneStopFlightsFromPostgres(from, to, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return data;
}

export async function getTwoStopFlights(from, to, context) {
  let data;
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      context.start("getTwoStopFlightsFromPostgres");
      data = await getTwoStopFlightsFromPostgres(from, to, context);
      context.stop();
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
