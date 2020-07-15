import path from "path";
import { promises as fs } from "fs";

const HOTELS_PATH = path.join(__dirname, "./../../data/hotel-data.json");
const HOTEL_INFO_PATH = path.join(__dirname, "./../../data/hotel-info.json");

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

  return text.includes(lowercaseExceptions[2])
    ? text.join("-")
    : text.join(" ");
}

async function parseMetadata(file) {
  const content = await fs.readFile(file);
  const metadata = JSON.parse(content);
  return metadata;
}

export async function getHotels(country, city, filters, context) {
  const { superchain, hotel, type, minCost, maxCost } = filters;
  context.start("parseMetadata");
  const metadata = await parseMetadata(HOTELS_PATH);
  context.stop();

  const hotelsData = metadata.filter((h) => {
    if (h.city !== capitalize(city) || h.country !== capitalize(country)) {
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

export async function getFilterList(filterType, context) {
  context.start("parseMetadata");
  const metadata = await parseMetadata(HOTEL_INFO_PATH);
  context.stop();
  const listOfFilterOptions = metadata.map((item) => item[filterType]);

  return [...new Set(listOfFilterOptions)];
}

export async function readinessCheck() {
  return true;
}
