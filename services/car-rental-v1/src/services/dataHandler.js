import path from "path";
import fs from 'fs';
import TagNotFoundError from "./../errors/TagNotFoundError";

const CARS_PATH = path.join(__dirname, "./../../data/cars.json");

let carData = null;

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

function parseMetadata(file) {
  const content = fs.readFileSync(file);
  const metadata = JSON.parse(content);
  return metadata;
}

function getCarData() {
  if (carData === null) {
    carData = parseMetadata(CARS_PATH);
  }
  return carData;
}

export function getCars(country, city, filters, context) {
  const { company, car, type, style, minCost, maxCost } = filters;
  context.start("getCarData");
  const data = getCarData();
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

export function getFilterList(filterType, context) {
  context.start("getCarData");
  const data = getCarData();
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
