import {
  getFlightInfoFromPostgres,
  getAirportFromPostgres,
  getAirportsFromPostgres,
  getAirportsListFromPostgres,
  getDirectFlightsFromPostgres,
  getOneStopFlightsFromPostgres,
  getTwoStopFlightsFromPostgres,
  postgresReadinessCheck,
} from "./postgresService";
import {
  TagNotFoundError,
  DatabaseNotFoundError,
  IllegalDateError,
} from "../errors";

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
    return ["non-stop", "one-stop", "two-stop"];
  }
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      return await getFlightInfoFromPostgres(filter);
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
}

export async function getAirports(city, country, code) {
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

export async function getDirectFlights(from, to, filters) {
  let flights;
  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      flights = await getDirectFlightsFromPostgres(from, to);
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return updateCost(flights, filters.dateFrom);
}

export async function getOneStopFlights(from, to, filters) {
  let flights;
  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      flights = await getOneStopFlightsFromPostgres(from, to);
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return updateCost(flights, filters.dateFrom);
}

export async function getTwoStopFlights(from, to, filters) {
  let flights;
  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }
  switch (process.env.FLIGHTS_DATABASE) {
    case "postgres":
      flights = await getTwoStopFlightsFromPostgres(from, to);
      break;
    default:
      throw new DatabaseNotFoundError(process.env.FLIGHTS_DATABASE);
  }
  return updateCost(flights, filters.dateFrom);
}

function updateCost(data, date) {
  const multiplier = dateMultiplier(date);

  let res = data.map(d => {
    d["cost"] = d["cost"] * multiplier;
    return d;
  });
  return res;
}

function dateMultiplier(dateFrom, dateTo) {
  let dateNow = new Date();
  let numDays = (dateFrom - dateNow) / (1000 * 3600 * 24); // convert time difference to days
  if (numDays < 0) {
    throw new IllegalDateError(dateFrom);
  } else if (numDays < 2) {
    return 2.25;
  } else if (numDays < 7) {
    return 1.75;
  } else if (numDays < 14) {
    return 1.5;
  } else if (numDays < 21) {
    return 1.2;
  } else if (numDays < 45) {
    return 1;
  } else if (numDays < 90) {
    return 0.8;
  } else {
    throw new IllegalDateError(dateFrom);
  }
}