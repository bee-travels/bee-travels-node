const hotels = require(process.env.INIT_CWD + "/hotel-data.json");
const hotelInfo = require(process.env.INIT_CWD + "/hotel-info.json");

async function getHotelData(city, country) {
  let locationHotels = [];

  for (let hotel = 0; hotel < hotels.length; hotel++) {
    if (hotels[hotel].country === country && hotels[hotel].city === city) {
      locationHotels.push(hotels[hotel]);
    }
  }
  return locationHotels;
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
  let topicArray = [];

  for (let hotel = 0; hotel < hotelInfo.length; hotel++) {
    if (!topicArray.includes(hotelInfo[hotel][topic])) {
      topicArray.push(hotelInfo[hotel][topic]);
    }
  }
  return topicArray;
}

export { getHotels, getInfo };
