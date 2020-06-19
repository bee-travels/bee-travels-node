import {
  getHotelDataFromMongo,
  getHotelInfoFromMongo,
  buildHotelMongoQuery,
  mongoReadinessCheck,
} from "./mongoService";
import {
  getHotelDataFromPostgres,
  getHotelInfoFromPostgres,
  buildHotelPostgresQuery,
  postgresReadinessCheck,
} from "./postgresService";
import {
  getHotelDataFromCloudant,
  getHotelInfoFromCloudant,
  buildHotelCloudantQuery,
  cloudantReadinessCheck,
} from "./cloudantService";
import TagNotFoundError from "./../errors/TagNotFoundError";
import DatabaseNotFoundError from "./../errors/DatabaseNotFoundError";

const filterTypes = ["superchain", "name", "type"];

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

export async function getHotels(country, city, filters, jaegerTracer) {
  let data;
  let query;
  switch (process.env.HOTEL_DATABASE) {
    case "mongodb":
      query = buildHotelMongoQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      jaegerTracer.start("getHotelDataFromMongo");
      data = await getHotelDataFromMongo(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "postgres":
      query = buildHotelPostgresQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      jaegerTracer.start("getHotelDataFromPostgres");
      data = await getHotelDataFromPostgres(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "cloudant":
    case "couchdb":
      query = buildHotelCloudantQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      jaegerTracer.start("getHotelDataFromCloudant");
      data = await getHotelDataFromCloudant(query, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.HOTEL_DATABASE);
  }
  return data;
}

export async function getFilterList(filterType, jaegerTracer) {
  if (filterTypes.includes(filterType) === false) {
    throw new TagNotFoundError(filterType);
  }
  let data;
  switch (process.env.HOTEL_DATABASE) {
    case "mongodb":
      jaegerTracer.start("getHotelInfoFromMongo");
      data = await getHotelInfoFromMongo(filterType, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "postgres":
      jaegerTracer.start("getHotelInfoFromPostgres");
      data = await getHotelInfoFromPostgres(filterType, jaegerTracer);
      jaegerTracer.stop();
      break;
    case "cloudant":
    case "couchdb":
      jaegerTracer.start("getHotelInfoFromCloudant");
      data = await getHotelInfoFromCloudant(filterType, jaegerTracer);
      jaegerTracer.stop();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.HOTEL_DATABASE);
  }
  return data;
}

export async function readinessCheck() {
  switch (process.env.HOTEL_DATABASE) {
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
