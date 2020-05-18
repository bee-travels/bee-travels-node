import {
  getDestinationDataFromMongo,
  buildDestinationMongoQuery,
} from "./mongoService";
import { getDestinationDataFromPostgres } from "./postgresService";
import { getDestinationDataFromCloudant } from "./cloudantService";
import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

async function loadData(db, query) {
  switch (db) {
    case "mongodb":
      return await getDestinationDataFromMongo(query);
    case "postgres":
      return await getDestinationDataFromPostgres(query);
    case "cloudant":
    case "couchdb":
      return await getDestinationDataFromCloudant(query);
    default:
      throw new DatabaseNotFoundError(db);
  }
}

export async function getCities() {
  return await loadData(process.env.DATABASE, {});
}

export async function getCitiesForCountry(country) {
  const query = buildDestinationMongoQuery(capitalize(country), null);
  return await loadData(process.env.DESTINATION_DATABASE, query);
}

export async function getCity(country, city) {
  const query = buildDestinationMongoQuery(
    capitalize(country),
    capitalize(city)
  );
  return await loadData(process.env.DESTINATION_DATABASE, query);
}
