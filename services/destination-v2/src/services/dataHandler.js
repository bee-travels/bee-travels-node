import path from "path";
import { promises as fs } from "fs";
import { getDestinationDataFromMongo } from "./mongoService";
import { getDestinationDataFromPostgres } from "./postgresService";
import { getDestinationDataFromCloudant } from "./cloudantService";

const DESTINATIONS_PATH = path.join(__dirname, "../../data/destinations.json");

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function parseMetadata(file) {
  const content = await fs.readFile(file);
  const metadata = JSON.parse(content);
  return metadata;
}

async function loadData(db, allData) {
  switch (db) {
    case "mongodb":
      return await getDestinationDataFromMongo();
    case "postgres":
      return await getDestinationDataFromPostgres();
    case "cloudant":
    case "couchdb":
      return await getDestinationDataFromCloudant();
    default:
      const fullData = await parseMetadata(DESTINATIONS_PATH);
      if (allData) {
        return fullData;
      }
      return fullData.map((item) => ({
        country: item.country,
        city: item.city,
      }));
  }
}

export async function getCities() {
  const metadata = await loadData(process.env.DATABASE, false);
  return metadata;
}

export async function getCitiesForCountry(country) {
  const metadata = await loadData(process.env.DATABASE, false);
  const citiesData = metadata.filter(
    (c) => pillify(c.country) === country.toLowerCase()
  );
  return citiesData;
}

export async function getCity(country, city) {
  const metadata = await loadData(process.env.DATABASE, true);
  const cityData = metadata.find(
    (c) =>
      pillify(c.city) === city.toLowerCase() &&
      pillify(c.country) === country.toLowerCase()
  );
  return cityData;
}
