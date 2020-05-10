import path from "path";
import { promises as fs } from "fs";
import { getCarDataFromMongo, getCarInfoFromMongo } from "./mongoService";
import {
  getCarDataFromPostgres,
  getCarInfoFromPostgres,
} from "./postgresService";
import {
  getCarDataFromCloudant,
  getCarInfoFromCloudant,
} from "./cloudantService";
import TagNotFoundError from "./../errors/TagNotFoundError";

const CARS_PATH = path.join(__dirname, "../../data/cars.json");

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function parseMetadata(file) {
  const content = await fs.readFile(file);
  const metadata = JSON.parse(content);
  return metadata;
}

async function loadData(db) {
  switch (db) {
    case "mongodb":
      return await getCarInfoFromMongo();
    case "postgres":
      return await getCarInfoFromPostgres();
    case "cloudant":
    case "couchdb":
      return await getCarInfoFromCloudant();
    default:
      return await parseMetadata(CARS_PATH);
  }
}

async function loadCarData(db) {
  switch (db) {
    case "mongodb":
      return await getCarDataFromMongo();
    case "postgres":
      return await getCarDataFromPostgres();
    case "cloudant":
    case "couchdb":
      return await getCarDataFromCloudant();
    default:
      return await parseMetadata(CARS_PATH);
  }
}

export async function getCars(country, city, filters) {
  const { company, car, type, style, minCost, maxCost } = filters;
  const data = await loadCarData(process.env.DATABASE);

  const carsData = data.filter((h) => {
    if (
      pillify(h.city) !== city.toLowerCase() ||
      pillify(h.country) !== country.toLowerCase()
    ) {
      return false;
    }

    return (
      (company === undefined || company.includes(h.rental_company)) &&
      (car === undefined || car.includes(h.name)) &&
      (type === undefined || type.includes(h.body_type)) &&
      (style === undefined || style.includes(h.style)) &&
      (minCost === undefined || minCost <= h.cost) &&
      (maxCost === undefined || h.cost <= maxCost)
    );
  });

  return carsData;
}

export async function getFilterList(filterType) {
  const data = await loadData(process.env.DATABASE);
  const listOfFilterOptions = data.map((item) => {
    const valueForFilter = item[filterType];
    if (valueForFilter !== undefined) {
      return valueForFilter;
    }
    throw new TagNotFoundError(filterType);
  });
  return [...new Set(listOfFilterOptions)];
}
