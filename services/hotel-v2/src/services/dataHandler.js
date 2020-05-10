import path from "path";
import { promises as fs } from "fs";
import { getHotelDataFromMongo, getHotelInfoFromMongo } from "./mongoService";
import {
  getHotelDataFromPostgres,
  getHotelInfoFromPostgres,
} from "./postgresService";
import {
  getHotelDataFromCloudant,
  getHotelInfoFromCloudant,
} from "./cloudantService";

const HOTELS_PATH = path.join(__dirname, "../../data/hotel-data.json");

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function parseMetadata(file) {
  const content = await fs.readFile(file);
  const metadata = JSON.parse(content);
  return metadata;
}

async function loadData(db) {
  switch (db) {
    case "mongodb":
      return await getHotelInfoFromMongo();
    case "postgres":
      return await getHotelInfoFromPostgres();
    case "cloudant":
    case "couchdb":
      return await getHotelInfoFromCloudant();
    default:
      return await parseMetadata(HOTELS_PATH);
  }
}

async function loadHotelData(db) {
  switch (db) {
    case "mongodb":
      return await getHotelDataFromMongo();
    case "postgres":
      return await getHotelDataFromPostgres();
    case "cloudant":
    case "couchdb":
      return await getHotelDataFromCloudant();
    default:
      return await parseMetadata(HOTELS_PATH);
  }
}
export async function getHotels(country, city, filters) {
  const { superchain, hotel, type, minCost, maxCost } = filters;
  const metadata = await loadHotelData(process.env.DATABASE);

  const hotelsData = metadata.filter((h) => {
    if (
      pillify(h.city) !== city.toLowerCase() ||
      pillify(h.country) !== country.toLowerCase()
    ) {
      return false;
    }

    return (
      (superchain === undefined || superchain.includes(h.superchain)) &&
      (hotel === undefined || hotel.includes(h.name)) &&
      (type === undefined || type.includes(h.type)) &&
      (minCost === undefined || minCost <= h.cost) &&
      (maxCost === undefined || h.cost <= maxCost)
    );
  });

  return hotelsData;
}

export async function getFilterList(filterType) {
  const metadata = await loadData(process.env.DATABASE);
  const listOfFilterOptions = metadata.map((item) => item[filterType]);
  return [...new Set(listOfFilterOptions)];
}
