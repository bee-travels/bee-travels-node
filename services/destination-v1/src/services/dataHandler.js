import path from "path";
import { promises as fs } from "fs";

const DESTINATIONS_PATH = path.join(__dirname, "./../../data/destinations.json");

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

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

export async function getCities(context) {
  context.start("parseMetadata");
  const metadata = await parseMetadata(DESTINATIONS_PATH, false);
  context.stop();
  return metadata;
}

export async function getCitiesForCountry(country, context) {
  context.start("parseMetadata");
  const metadata = await parseMetadata(DESTINATIONS_PATH, false);
  context.stop();
  const citiesData = metadata.filter((c) => c.country === capitalize(country));
  return citiesData;
}

export async function getCity(country, city, context) {
  context.start("parseMetadata");
  const metadata = await parseMetadata(DESTINATIONS_PATH, true);
  context.stop();
  const cityData = metadata.find(
    (c) => c.city === capitalize(city) && c.country === capitalize(country)
  );
  return cityData;
}

export async function readinessCheck() {
  return true;
}
