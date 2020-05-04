import path from "path";
import { promises as fs } from "fs";
import parse from "csv-parse/lib/sync";
import CSVParsingError from "./../errors/CSVParsingError";

const CSV_PATH = path.join(__dirname, "../../data/cities.csv");

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function parseMetadata(csv) {
  try {
    const content = await fs.readFile(csv);
    const metadata = parse(content, {
      columns: ["city", "lat", "lng", "country", "population", "description"],
    });
    return metadata;
  } catch (e) {
    throw new CSVParsingError(e.message);
  }
}

export async function getCities() {
  const metadata = await parseMetadata(CSV_PATH);
  return metadata;
}

export async function getCitiesForCountry(country) {
  const metadata = await parseMetadata(CSV_PATH);
  const citiesData = metadata.filter(
    (r) => pillify(r.country) === country.toLowerCase()
  );
  return citiesData;
}

export async function getCity(country, city) {
  const metadata = await parseMetadata(CSV_PATH);
  const cityData = metadata.find(
    (r) =>
      pillify(r.city) === city.toLowerCase() &&
      pillify(r.country) === country.toLowerCase()
  );
  return cityData;
}
