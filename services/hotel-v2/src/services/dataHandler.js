import {
  getHotelDataFromMongo,
  getHotelInfoFromMongo,
  buildHotelMongoQuery,
} from "./mongoService";
import {
  getHotelDataFromPostgres,
  getHotelInfoFromPostgres,
} from "./postgresService";
import {
  getHotelDataFromCloudant,
  getHotelInfoFromCloudant,
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

export async function getHotels(country, city, filters) {
  let data;
  let query;
  switch (process.env.HOTEL_DATABASE) {
    case "mongodb":
      query = buildHotelMongoQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      data = await getHotelDataFromMongo(query);
      break;
    case "postgres":
      data = await getHotelDataFromPostgres();
      break;
    case "cloudant":
    case "couchdb":
      data = await getHotelDataFromCloudant();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.HOTEL_DATABASE);
  }

  return data;
}

export async function getFilterList(filterType) {
  if (filterTypes.includes(filterType) === false) {
    throw new TagNotFoundError(filterType);
  }
  switch (process.env.HOTEL_DATABASE) {
    case "mongodb":
      return await getHotelInfoFromMongo(filterType);
    case "postgres":
      return await getHotelInfoFromPostgres();
    case "cloudant":
    case "couchdb":
      return await getHotelInfoFromCloudant();
    default:
      throw new DatabaseNotFoundError(process.env.HOTEL_DATABASE);
  }
}
