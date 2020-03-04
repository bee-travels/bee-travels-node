var hotels = require(process.env.INIT_CWD + '/hotel-data.json');
var hotelInfo = require(process.env.INIT_CWD + '/hotel-info.json');

function getHotels(city, country, f) {
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
  var data = hotels[country][city];
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

function getInfo(topic) {
  return hotelInfo[topic];
}

export { getHotels, getInfo };
