import path from "path";
import { promises as fs } from "fs";
import parse from "csv-parse/lib/sync";
import CSVParsingError from "./../errors/CSVParsingError";

const CSV_PATH = path.join(__dirname, "../../data/cities.csv");

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function parseMetadata(csv, allData) {
  try {
    const content = await fs.readFile(csv);
    const metadata = parse(content, {
      columns: [
        "city",
        allData ? "lat" : null,
        allData ? "lng" : null,
        "country",
        allData ? "population" : null,
        allData ? "description" : null,
      ],
    });
    return metadata.slice(1);
  } catch (e) {
    throw new CSVParsingError(e.message);
  }
}

export async function getCities() {
  const metadata = await parseMetadata(CSV_PATH, false);
  return metadata;
}

export async function getCitiesForCountry(country) {
  const metadata = await parseMetadata(CSV_PATH, false);
  const citiesData = metadata.filter(
    (c) => pillify(c.country) === country.toLowerCase()
  );
  return citiesData;
}

export async function getCity(country, city) {
  const metadata = await parseMetadata(CSV_PATH, true);
  const cityData = metadata.find(
    (c) =>
      pillify(c.city) === city.toLowerCase() &&
      pillify(c.country) === country.toLowerCase()
  );
  return cityData;
}
