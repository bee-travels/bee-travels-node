import {
  getHotelDataFromMongo,
  getHotelInfoFromMongo,
  buildHotelMongoQuery,
} from "./mongoService";
import {
  getHotelDataFromPostgres,
  getHotelInfoFromPostgres,
  buildHotelPostgresQuery,
} from "./postgresService";
import {
  getHotelDataFromCloudant,
  getHotelInfoFromCloudant,
  buildHotelCloudantQuery,
} from "./cloudantService";
import {
  TagNotFoundError,
  DatabaseNotFoundError,
  IllegalDateError,
} from "./../errors";

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

  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }

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
      query = buildHotelPostgresQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      data = await getHotelDataFromPostgres(query);
      break;
    case "cloudant":
    case "couchdb":
      query = buildHotelCloudantQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      data = await getHotelDataFromCloudant(query);
      break;
    default:
      throw new DatabaseNotFoundError(process.env.HOTEL_DATABASE);
  }

  return updateCost(data, filters.dateFrom);
}

export async function getFilterList(filterType) {
  if (filterTypes.includes(filterType) === false) {
    throw new TagNotFoundError(filterType);
  }
  switch (process.env.HOTEL_DATABASE) {
    case "mongodb":
      return await getHotelInfoFromMongo(filterType);
    case "postgres":
      return await getHotelInfoFromPostgres(filterType);
    case "cloudant":
    case "couchdb":
      return await getHotelInfoFromCloudant(filterType);
    default:
      throw new DatabaseNotFoundError(process.env.HOTEL_DATABASE);
  }
}

function updateCost(data, date) {
  const multiplier = dateMultiplier(date);

  let res = data.map((d) => {
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
