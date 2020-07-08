import {
  getCarDataFromMongo,
  getCarInfoFromMongo,
  buildCarMongoQuery,
} from "./mongoService";
import {
  getCarDataFromPostgres,
  getCarInfoFromPostgres,
  buildCarPostgresQuery,
} from "./postgresService";
import {
  getCarDataFromCloudant,
  getCarInfoFromCloudant,
  buildCarCloudantQuery,
} from "./cloudantService";
import {TagNotFoundError, DatabaseNotFoundError, IllegalDateError} from "./../errors";

const filterTypes = ["rental_company", "name", "body_type", "style"];

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

export async function getCars(country, city, filters) {
  let query;
  let cars;
  
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      query = buildCarMongoQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      cars = await getCarDataFromMongo(query);
      break;
    case "postgres":
      query = buildCarPostgresQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      cars = await getCarDataFromPostgres(query);
      break;
    case "cloudant":
    case "couchdb":
      query = buildCarCloudantQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      cars = await getCarDataFromCloudant(query);
      break;
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
  return updateCost(cars, filters.dateFrom);
}

export async function getFilterList(filterType) {
  if (filterTypes.includes(filterType) === false) {
    throw new TagNotFoundError(filterType);
  }
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      return await getCarInfoFromMongo(filterType);
    case "postgres":
      return await getCarInfoFromPostgres(filterType);
    case "cloudant":
    case "couchdb":
      return await getCarInfoFromCloudant(filterType);
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
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
  } else if (numDays < 3) {
    return 3;
  } else if (numDays < 7) {
    return 2;
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
