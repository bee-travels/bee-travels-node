import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";
import {
  getFlightInfoFromPostgres,
  getAirportFromPostgres,
  getAirportsFromPostgres,
  getAirportsListFromPostgres,
  getDirectFlightsFromPostgres,
  getOneStopFlightsFromPostgres,
  getTwoStopFlightsFromPostgres,
} from "./postgresService";
import TagNotFoundError from "../errors/TagNotFoundError";

const filterTypes = ["airlines", "type"];

const capitalize = (text) => {
  if (!text) return text;
  return text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

const upper = (text) => (text ? text.toUpperCase() : text);

export async function getFilterList(filter) {
  if (!filterTypes.includes(filter)) {
    throw new TagNotFoundError(filter);
  }
  if (filter === "type") {
    return ["non-stop", "one-stop", "two-stop"]
  }
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getFlightInfoFromPostgres(filter);
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
}

export async function getAirports(city, country, code) {
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getAirportsFromPostgres(
        capitalize(city),
        capitalize(country),
        upper(code)
      );
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
}

export async function getAirportsList() {
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getAirportsListFromPostgres();
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
}

export async function getAirport(id) {
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getAirportFromPostgres(id);
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
}

export async function getDirectFlights(from, to) {
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getDirectFlightsFromPostgres(from, to);
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
}

export async function getOneStopFlights(from, to) {
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getOneStopFlightsFromPostgres(from, to);
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
}

export async function getTwoStopFlights(from, to) {
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getTwoStopFlightsFromPostgres(from, to);
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
}
