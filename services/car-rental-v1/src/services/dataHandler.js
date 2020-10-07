import path from "path";
import fs from "fs";
import TagNotFoundError from "./../errors/TagNotFoundError";
import IllegalDateError from "./../errors/IllegarDateError";
import ItemNotFoundError from "./../errors/ItemNotFoundError";

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
  // context.start("getCarData");
  const data = getCarData();
  // context.stop();

  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }
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

  return updateCost(carsData, filters.dateFrom);
}

export function getFilterList(filterType, context) {
  // context.start("getCarData");
  const data = getCarData();
  // context.stop();
  const listOfFilterOptions = data.map((item) => {
    const valueForFilter = item[filterType];
    if (valueForFilter !== undefined) {
      return valueForFilter;
    }
    throw new TagNotFoundError(filterType);
  });
  return [...new Set(listOfFilterOptions)];
}

export function getCarByID(id, filters) {
  const data = getCarData();
  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }
  const d = data.find(item => item.id === id);
  if(!d) {
    throw new ItemNotFoundError(id);
  }

  const multiplier = dateMultiplier(filters.dateFrom);
  let res = JSON.parse(JSON.stringify(d));
  res["cost"] = res["cost"] * multiplier;
  res["dateFrom"] = filters.dateFrom;
  res["dateTo"] = filters.dateTo;
  return res;
}

export async function readinessCheck() {
  return true;
}


function updateCost(data, date) {
  const multiplier = dateMultiplier(date);

  let res = data.map((d) => {
    const p = JSON.parse(JSON.stringify(d))
    p["cost"] = p["cost"] * multiplier;
    return p;
  });
  return res;
}

function dateMultiplier(dateFrom, dateTo) {
  let dateNow = new Date();
  let numDays = (dateFrom - dateNow) / (1000 * 3600 * 24); // convert time difference to days
  if (numDays < 0) {
    throw new IllegalDateError(dateFrom);
  } else if (numDays < 2) {
    return 2.25;
  } else if (numDays < 7) {
    return 1.75;
  } else if (numDays < 14) {
    return 1.5;
  } else if (numDays < 21) {
    return 1.2;
  } else if (numDays < 45) {
    return 1;
  } else if (numDays < 90) {
    return 0.8;
  } else {
    throw new IllegalDateError(dateFrom);
  }
}