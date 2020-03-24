import { getHotelFromMongo, getHotelInfoFromMongo } from './mongoService';
import { getHotelFromPostgres, getHotelInfoFromPostgres } from './postgresService';

async function getHotelData(city, country) {
  if (process.env.DATABASE) {
    var hotel;
    if (process.env.DATABASE.indexOf('mongodb') > -1) {
      hotel = await getHotelFromMongo(city, country);
      return hotel;
    } else if (process.env.DATABASE.indexOf('postgres') > -1) {
      hotel = await getHotelFromPostgres(city, country);
      return hotel;
    }
  } else {
    var locationHotels = [];
    var hotels = require(process.env.INIT_CWD + '/hotel-data.json');
    for (var hotel = 0; hotel < hotels.length; hotel++) {
      if (hotels[hotel].country == country && hotels[hotel].city == city){
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
    .replace('%20', ' ')
    .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
  city = city
    .trim()
    .toLowerCase()
    .replace('%20', ' ')
    .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
  var data = await getHotelData(city, country);
  if (!f && data) {
    return data;
  } else if (data) {
    data = data.filter(hotel => {
      var matchSuperchain = f.superchain.length === 0 || f.superchain.includes(hotel.superchain);
      var matchHotel = f.hotel.length === 0 || f.hotel.includes(hotel.name);
      var matchType = f.type.length === 0 || f.type.includes(hotel.type);
      var costHigherThan = hotel['cost'] > f.minCost;
      var costLowerThan = hotel['cost'] < f.maxCost;
      return matchSuperchain && matchHotel && matchType && costHigherThan && costLowerThan;
    });
  }

  return data;
}

async function getInfo(topic) {
  var hotelInfo;
  var topicArray = [];
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf('mongodb') > -1) {
      hotelInfo = await getHotelInfoFromMongo();
    } else if (process.env.DATABASE.indexOf('postgres') > -1) {
      hotelInfo = await getHotelInfoFromPostgres();
    }
  } else {
    hotelInfo = require(process.env.INIT_CWD + '/hotel-info.json');
  }
  for (var hotel = 0; hotel < hotelInfo.length; hotel++) {
    if (!topicArray.includes(hotelInfo[hotel][topic])){
      topicArray.push(hotelInfo[hotel][topic]);
    }
  }
  return topicArray;
}

export { getHotels, getInfo };
