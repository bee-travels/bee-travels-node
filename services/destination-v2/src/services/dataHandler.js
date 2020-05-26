import {
  getDestinationDataFromMongo,
  buildDestinationMongoQuery,
} from "./mongoService";
import {
  getDestinationDataFromPostgres,
  buildDestinationPostgresQuery,
} from "./postgresService";
import {
  getDestinationDataFromCloudant,
  buildDestinationCloudantQuery,
} from "./cloudantService";
import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

export async function getCities() {
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      return await getDestinationDataFromMongo({});
    case "postgres":
      return await getDestinationDataFromPostgres({
        statement: "",
        values: [],
      });
    case "cloudant":
    case "couchdb":
      return await getDestinationDataFromCloudant({});
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
}

export async function getCitiesForCountry(country) {
  let query;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      query = buildDestinationMongoQuery(capitalize(country), null);
      return await getDestinationDataFromMongo(query);
    case "postgres":
      query = buildDestinationPostgresQuery(capitalize(country), null);
      return await getDestinationDataFromPostgres(query);
    case "cloudant":
    case "couchdb":
      query = buildDestinationCloudantQuery(capitalize(country), null);
      return await getDestinationDataFromCloudant(query);
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
}

export async function getCity(country, city) {
  let query;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      query = buildDestinationMongoQuery(capitalize(country), capitalize(city));
      return await getDestinationDataFromMongo(query);
    case "postgres":
      query = buildDestinationPostgresQuery(
        capitalize(country),
        capitalize(city)
      );
      return await getDestinationDataFromPostgres(query);
    case "cloudant":
    case "couchdb":
      query = buildDestinationCloudantQuery(
        capitalize(country),
        capitalize(city)
      );
      return await getDestinationDataFromCloudant(query);
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
}
