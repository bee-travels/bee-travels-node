import path from "path";
import { promises as fs } from "fs";
import {
  getCarDataFromMongo,
  getCarInfoFromMongo,
  buildCarMongoQuery,
} from "./mongoService";
import {
  getCarDataFromPostgres,
  getCarInfoFromPostgres,
} from "./postgresService";
import {
  getCarDataFromCloudant,
  getCarInfoFromCloudant,
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
  let data;
  let query;
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      query = buildCarMongoQuery(
        capitalize(country),
        capitalize(city),
        filters
      );
      data = await getCarDataFromMongo(query);
      break;
    case "postgres":
      data = await getCarDataFromPostgres();
      break;
    case "cloudant":
    case "couchdb":
      data = await getCarDataFromCloudant();
      break;
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }

  return data;
}

export async function getFilterList(filterType) {
  if (filterTypes.includes(filterType) === false) {
    throw new TagNotFoundError(filterType);
  }
  switch (process.env.CAR_DATABASE) {
    case "mongodb":
      return await getCarInfoFromMongo(filterType);
    case "postgres":
      return await getCarInfoFromPostgres();
    case "cloudant":
    case "couchdb":
      return await getCarInfoFromCloudant();
    default:
      throw new DatabaseNotFoundError(process.env.CAR_DATABASE);
  }
}
