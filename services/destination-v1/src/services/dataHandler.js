import path from "path";
import fs from "fs";

const DESTINATIONS_PATH = path.join(
  __dirname,
  "./../../data/destinations.json"
);

let destinationData = null;
let destinationDataCityAndCountry = null;

// Cities with these words in the city name are lower case
const lowercaseExceptions = ["es", "de", "au"];

function capitalize(text) {
  text = text
    .toLowerCase()
    .split("-")
    .map((s) =>
      lowercaseExceptions.includes(s)
        ? s
        : s.charAt(0).toUpperCase() + s.substring(1)
    );

  // The city of Port-au-Prince keeps "-" between the words of the city
  return text.includes(lowercaseExceptions[2])
    ? text.join("-")
    : text.join(" ");
}

function parseMetadata(file, allData) {
  const content = fs.readFileSync(file);
  const metadata = JSON.parse(content);
  return metadata;
}

function getAllDestination() {
  if (destinationData === null) {
    destinationData = parseMetadata(DESTINATIONS_PATH);
  }
  return destinationData;
}

function getDestinationCityAndCountry() {
  if (destinationDataCityAndCountry === null) {
    const metadata = getAllDestination();
    destinationDataCityAndCountry = metadata.map((item) => ({
      country: item.country,
      city: item.city,
    }));
  }
  return destinationDataCityAndCountry;
}

export function getCities(context) {
  // context.start("parseMetadata");
  const metadata = getDestinationCityAndCountry();
  // context.stop();
  return metadata;
}

export function getCitiesForCountry(country, context) {
  // context.start("parseMetadata");
  const metadata = getDestinationCityAndCountry();
  // context.stop();
  const citiesData = metadata.filter((c) => c.country === capitalize(country));
  return citiesData;
}

export function getCity(country, city, context) {
  // context.start("parseMetadata");
  const metadata = getAllDestination();
  // context.stop();
  const cityData = metadata.find(
    (c) => c.city === capitalize(city) && c.country === capitalize(country)
  );
  return cityData;
}

export async function readinessCheck() {
  return true;
}
