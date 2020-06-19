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

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

export async function getCities(jaegerTracer) {
  let data;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      jaegerTracer.start("getDestinationDataFromMongo");
      data = await getDestinationDataFromMongo({}, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "postgres":
      jaegerTracer.start("getDestinationDataFromPostgres");
      data = await getDestinationDataFromPostgres(
        {
          statement: "",
          values: [],
        },
        jaegerTracer
      );
      jaegerTracer.stop();
      break;
    case "cloudant":
    case "couchdb":
      jaegerTracer.start("getDestinationDataFromCloudant");
      data = await getDestinationDataFromCloudant({}, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
  return data;
}

export async function getCitiesForCountry(country, jaegerTracer) {
  let data;
  let query;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      query = buildDestinationMongoQuery(capitalize(country), null);
      jaegerTracer.start("getDestinationDataFromMongo");
      data = await getDestinationDataFromMongo(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "postgres":
      query = buildDestinationPostgresQuery(capitalize(country), null);
      jaegerTracer.start("getDestinationDataFromPostgres");
      data = await getDestinationDataFromPostgres(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "cloudant":
    case "couchdb":
      query = buildDestinationCloudantQuery(capitalize(country), null);
      jaegerTracer.start("getDestinationDataFromCloudant");
      data = await getDestinationDataFromCloudant(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.DESTINATION_DATABASE);
  }
  return data;
}

export async function getCity(country, city, jaegerTracer) {
  let data;
  let query;
  switch (process.env.DESTINATION_DATABASE) {
    case "mongodb":
      query = buildDestinationMongoQuery(capitalize(country), capitalize(city));
      jaegerTracer.start("getDestinationDataFromMongo");
      data = await getDestinationDataFromMongo(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "postgres":
      query = buildDestinationPostgresQuery(
        capitalize(country),
        capitalize(city)
      );
      jaegerTracer.start("getDestinationDataFromPostgres");
      data = await getDestinationDataFromPostgres(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "cloudant":
    case "couchdb":
      query = buildDestinationCloudantQuery(
        capitalize(country),
        capitalize(city)
      );
      jaegerTracer.start("getDestinationDataFromCloudant");
      data = await getDestinationDataFromCloudant(query, jaegerTracer);
      jaegerTracer.stop();
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
