import path from "path";
import fs from "fs";
import IllegalDateError from "../errors/IllegarDateError";
import ItemNotFoundError from "./../errors/ItemNotFoundError";

const HOTELS_PATH = path.join(__dirname, "./../../data/hotel-data.json");
const HOTEL_INFO_PATH = path.join(__dirname, "./../../data/hotel-info.json");

// Cities with these words in the city name are lower case
const lowercaseExceptions = ["es", "de", "au"];

let hotelData = null;
let hotelInfo = null;

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

function kebabCase(data) {
  return data;
}

function parseMetadata(file) {
  const content = fs.readFileSync(file);
  const metadata = JSON.parse(content);
  return metadata;
}

function getHotelData() {
  if (hotelData === null) {
    hotelData = parseMetadata(HOTELS_PATH);
  }
  return hotelData;
}

function getHotelInfo() {
  if (hotelInfo === null) {
    hotelInfo = parseMetadata(HOTEL_INFO_PATH);
  }
  return hotelInfo;
}

export function getHotels(country, city, filters, context) {
  const { superchain, hotel, type, minCost, maxCost } = filters;
  if (filters.dateTo - filters.dateFrom < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }
  const metaData = getHotelData();
  const hotelsData = metaData.filter((h) => {
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

  return updateCost(hotelsData, filters.dateFrom);
}

export function getFilterList(filterType, context) {
  const metaData = getHotelInfo();

  const listOfFilterOptions = metaData.map((item) => item[filterType]);

  return [...new Set(listOfFilterOptions)];
}

export function getHotelByID(id, filters) {
  const data = getHotelData();
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
