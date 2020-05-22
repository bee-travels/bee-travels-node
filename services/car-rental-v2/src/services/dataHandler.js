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
import TagNotFoundError from "./../errors/TagNotFoundError";
import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";

const filterTypes = ["rental_company", "name", "body_type", "style"];

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

export async function getCars(country, city, filters) {
  let query;
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      query = buildCarMongoQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      return await getCarDataFromMongo(query);
    case "postgres":
      query = buildCarPostgresQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      return await getCarDataFromPostgres(query);
    case "cloudant":
    case "couchdb":
      query = buildCarCloudantQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      return await getCarDataFromCloudant(query);
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
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
