import path from "path";
import fs from 'fs';

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

  return hotelsData;
}

export function getFilterList(filterType, context) {
  const metaData = getHotelInfo();

  const listOfFilterOptions = metaData.map((item) => item[filterType]);

  return [...new Set(listOfFilterOptions)];
}

export async function readinessCheck() {
  return true;
}
