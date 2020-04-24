import { getHotelDataFromMongo, getHotelInfoFromMongo } from "./mongoService";
import {
  getHotelDataFromPostgres,
  getHotelInfoFromPostgres,
} from "./postgresService";
import {
  getHotelDataFromCloudant,
  getHotelInfoFromCloudant,
} from "./cloudantService";

async function getHotelData(city, country) {
  let hotels;
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      hotels = await getHotelDataFromMongo(city, country);
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      hotels = await getHotelDataFromPostgres(city, country);
    } else {
      hotels = await getHotelDataFromCloudant(city, country);
    }
    return hotels;
  } else {
    let locationHotels = [];
    hotels = require(process.env.INIT_CWD + "/hotel-data.json");
    for (let hotel = 0; hotel < hotels.length; hotel++) {
      if (hotels[hotel].country === country && hotels[hotel].city === city) {
        locationHotels.push(hotels[hotel]);
      }
    }
    return locationHotels;
  }
}

async function getHotels(city, country, f) {
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
  let data = await getHotelData(city, country);
  if (!f && data) {
    return data;
  } else if (data) {
    data = data.filter((hotel) => {
      const matchSuperchain =
        f.superchain.length === 0 || f.superchain.includes(hotel.superchain);
      const matchHotel = f.hotel.length === 0 || f.hotel.includes(hotel.name);
      const matchType = f.type.length === 0 || f.type.includes(hotel.type);
      const costHigherThan = hotel["cost"] > f.minCost;
      const costLowerThan = hotel["cost"] < f.maxCost;
      return (
        matchSuperchain &&
        matchHotel &&
        matchType &&
        costHigherThan &&
        costLowerThan
      );
    });
  }

  return data;
}

async function getInfo(topic) {
  let hotelInfo;
  let topicArray = [];
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      hotelInfo = await getHotelInfoFromMongo();
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      hotelInfo = await getHotelInfoFromPostgres();
    } else {
      hotelInfo = await getHotelInfoFromCloudant();
    }
  } else {
    hotelInfo = require(process.env.INIT_CWD + "/hotel-info.json");
  }
  for (let hotel = 0; hotel < hotelInfo.length; hotel++) {
    if (!topicArray.includes(hotelInfo[hotel][topic])) {
      topicArray.push(hotelInfo[hotel][topic]);
    }
  }
  return topicArray;
}

export { getHotels, getInfo };
