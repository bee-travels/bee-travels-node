import path from "path";
import { promises as fs } from "fs";

const DESTINATIONS_PATH = path.join(__dirname, "../../data/destinations.json");

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function parseMetadata(file, allData) {
  const content = await fs.readFile(file);
  const metadata = JSON.parse(content);
  if (allData) {
    return metadata;
  }
  return metadata.map((item) => ({
    country: item.country,
    city: item.city,
  }));
}

export async function getCities() {
  const metadata = await parseMetadata(DESTINATIONS_PATH, false);
  return metadata;
}

export async function getCitiesForCountry(country) {
  const metadata = await parseMetadata(DESTINATIONS_PATH, false);
  const citiesData = metadata.filter(
    (c) => pillify(c.country) === country.toLowerCase()
  );
  return citiesData;
}

export async function getCity(country, city) {
  const metadata = await parseMetadata(DESTINATIONS_PATH, true);
  const cityData = metadata.find(
    (c) =>
      pillify(c.city) === city.toLowerCase() &&
      pillify(c.country) === country.toLowerCase()
  );
  return cityData;
}
