import path from "path";
import { promises as fs } from "fs";
import TagNotFoundError from "./../errors/TagNotFoundError";

const CARS_PATH = path.join(__dirname, "./../../data/cars.json");

const capitalize = (text) =>
  text
    .toLowerCase()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

async function parseMetadata(file) {
  const content = await fs.readFile(file);
  const metadata = JSON.parse(content);
  return metadata;
}

export async function getCars(country, city, filters, context) {
  const { company, car, type, style, minCost, maxCost } = filters;
  context.start("parseMetadata");
  const data = await parseMetadata(CARS_PATH);
  context.stop();

  const carsData = data.filter((h) => {
    if (h.city !== capitalize(city) || h.country !== capitalize(country)) {
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

export async function getFilterList(filterType, context) {
  context.start("parseMetadata");
  const data = await parseMetadata(CARS_PATH);
  context.stop();
  const listOfFilterOptions = data.map((item) => {
    const valueForFilter = item[filterType];
    if (valueForFilter !== undefined) {
      return valueForFilter;
    }
    throw new TagNotFoundError(filterType);
  });
  return [...new Set(listOfFilterOptions)];
}

export async function readinessCheck() {
  return true;
}
