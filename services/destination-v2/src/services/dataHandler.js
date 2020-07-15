import {
  getDestinationDataFromMongo,
  buildDestinationMongoQuery,
  mongoReadinessCheck,
} from "./mongoService";
import {
  getDestinationDataFromPostgres,
  buildDestinationPostgresQuery,
  postgresReadinessCheck,
} from "./postgresService";
import {
  getDestinationDataFromCloudant,
  buildDestinationCloudantQuery,
  cloudantReadinessCheck,
} from "./cloudantService";
import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";

// Cities with these words in the city name are lower case
const lowercaseExceptions = ["es", "de", "au"];

function capitalize(text) {
  text = text
    .toLowerCase()
    .split("-")
    .map((s) =>
      lowercaseExceptions.includes(s)
        ? s
        : s.charAt(0).toUpperCase() + s.substring(1)
    );

  // The city of Port-au-Prince keeps "-" between the words of the city
  return text.includes(lowercaseExceptions[2])
    ? text.join("-")
    : text.join(" ");
}

export async function getCities(context) {
  let data;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      context.start("getDestinationDataFromMongo");
      data = await getDestinationDataFromMongo({}, context);
      context.stop();
      break;
    case "postgres":
      context.start("getDestinationDataFromPostgres");
      data = await getDestinationDataFromPostgres(
        {
          statement: "",
          values: [],
        },
        context
      );
      context.stop();
      break;
    case "cloudant":
    case "couchdb":
      context.start("getDestinationDataFromCloudant");
      data = await getDestinationDataFromCloudant({}, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
  return data;
}

export async function getCitiesForCountry(country, context) {
  let data;
  let query;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      query = buildDestinationMongoQuery(capitalize(country), null);
      context.start("getDestinationDataFromMongo");
      data = await getDestinationDataFromMongo(query, context);
      context.stop();
      break;
    case "postgres":
      query = buildDestinationPostgresQuery(capitalize(country), null);
      context.start("getDestinationDataFromPostgres");
      data = await getDestinationDataFromPostgres(query, context);
      context.stop();
      break;
    case "cloudant":
    case "couchdb":
      query = buildDestinationCloudantQuery(capitalize(country), null);
      context.start("getDestinationDataFromCloudant");
      data = await getDestinationDataFromCloudant(query, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
  return data;
}

export async function getCity(country, city, context) {
  let data;
  let query;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      query = buildDestinationMongoQuery(capitalize(country), capitalize(city));
      context.start("getDestinationDataFromMongo");
      data = await getDestinationDataFromMongo(query, context);
      context.stop();
      break;
    case "postgres":
      query = buildDestinationPostgresQuery(
        capitalize(country),
        capitalize(city)
      );
      context.start("getDestinationDataFromPostgres");
      data = await getDestinationDataFromPostgres(query, context);
      context.stop();
      break;
    case "cloudant":
    case "couchdb":
      query = buildDestinationCloudantQuery(
        capitalize(country),
        capitalize(city)
      );
      context.start("getDestinationDataFromCloudant");
      data = await getDestinationDataFromCloudant(query, context);
      context.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
  return data;
}

export async function readinessCheck() {
  switch (process.env.DESTINATION_DATABASE) {
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
