import {
  getCarDataFromMongo,
  getCarInfoFromMongo,
  buildCarMongoQuery,
  mongoReadinessCheck,
} from "./mongoService";
import {
  getCarDataFromPostgres,
  getCarInfoFromPostgres,
  buildCarPostgresQuery,
  postgresReadinessCheck,
} from "./postgresService";
import {
  getCarDataFromCloudant,
  getCarInfoFromCloudant,
  buildCarCloudantQuery,
  cloudantReadinessCheck,
} from "./cloudantService";
import {TagNotFoundError, DatabaseNotFoundError, IllegalDateError} from "./../errors";

const filterTypes = ["rental_company", "name", "body_type", "style"];

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

export async function getCars(country, city, filters, context) {
  let data;
  let query;

  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }
  
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      query = buildCarMongoQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      context.start("getCarDataFromMongo");
      data = await getCarDataFromMongo(query, context);
      context.stop();
      break;
    case "postgres":
      query = buildCarPostgresQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      context.start("getCarDataFromPostgres");
      data = await getCarDataFromPostgres(query, context);
      context.stop();
      break;
    case "cloudant":
    case "couchdb":
      query = buildCarCloudantQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      context.start("getCarDataFromCloudant");
      data = await getCarDataFromCloudant(query, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
  return updateCost(data, filters.dateFrom);
}

export async function getFilterList(filterType, context) {
  if (filterTypes.includes(filterType) === false) {
    throw new TagNotFoundError(filterType);
  }
  let data;
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      context.start("getCarInfoFromMongo");
      data = await getCarInfoFromMongo(filterType, context);
      context.stop();
      break;
    case "postgres":
      context.start("getCarInfoFromPostgres");
      data = await getCarInfoFromPostgres(filterType, context);
      context.stop();
      break;
    case "cloudant":
    case "couchdb":
      context.start("getCarInfoFromCloudant");
      data = await getCarInfoFromCloudant(filterType, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
  return data;
}

export async function readinessCheck() {
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      return await mongoReadinessCheck();
    case "postgres":
      return await postgresReadinessCheck();
    case "cloudant":
    case "couchdb":
      return await cloudantReadinessCheck();
    default:
      return false;
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
