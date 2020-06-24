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
import TagNotFoundError from "./../errors/TagNotFoundError";
import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";

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
  return data;
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
