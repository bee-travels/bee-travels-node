import { getHotelDataFromMongo, getHotelInfoFromMongo } from "./mongoService";
import {
  getHotelDataFromPostgres,
  getHotelInfoFromPostgres,
} from "./postgresService";
import {
  getHotelDataFromCloudant,
  getHotelInfoFromCloudant,
} from "./cloudantService";

const HOTELS_PATH = process.env.INIT_CWD + "/hotel-data.json";
const HOTEL_INFO_PATH = process.env.INIT_CWD + "/hotel-info.json";

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function getHotelData(country, city) {
  let hotels;
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      hotels = await getHotelDataFromMongo(country, city);
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      hotels = await getHotelDataFromPostgres(country, city);
    } else {
      hotels = await getHotelDataFromCloudant(country, city);
    }
    return hotels;
  } else {
    let locationHotels = [];
    hotels = require(HOTELS_PATH);
    for (let hotel = 0; hotel < hotels.length; hotel++) {
      if (hotels[hotel].country === country && hotels[hotel].city === city) {
        locationHotels.push(hotels[hotel]);
      }
    }
    return locationHotels;
  }
}

export async function getHotels(country, city, filters) {
  country = country
    .trim()
    .toLowerCase()
    .replace("%20", " ")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  city = city
    .trim()
    .toLowerCase()
    .replace("%20", " ")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

  const { superchain, hotel, type, minCost, maxCost } = filters;
  const metadata = await getHotelData(city, country);

  const hotelsData = metadata.filter((h) => {
    if (
      pillify(h.city) !== city.toLowerCase() ||
      pillify(h.country) !== country.toLowerCase()
    ) {
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

export async function getFilterList(filterType) {
  let metadata;
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      metadata = await getHotelInfoFromMongo();
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      metadata = await getHotelInfoFromPostgres();
    } else {
      metadata = await getHotelInfoFromCloudant();
    }
  } else {
    metadata = require(HOTEL_INFO_PATH);
  }
  const listOfFilterOptions = metadata.map((item) => item[filterType]);
  return [...new Set(listOfFilterOptions)];
}
