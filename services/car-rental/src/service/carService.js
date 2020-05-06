import { getCarDataFromMongo, getCarInfoFromMongo } from "./mongoService";
import {
  getCarDataFromPostgres,
  getCarInfoFromPostgres,
} from "./postgresService";
import {
  getCarDataFromCloudant,
  getCarInfoFromCloudant,
} from "./cloudantService";

async function getCarData(city, country) {
  var cars;
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      cars = await getCarDataFromMongo(city, country);
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      cars = await getCarDataFromPostgres(city, country);
    } else {
      cars = await getCarDataFromCloudant(city, country);
    }
    return cars;
  } else {
    var locationCars = [];
    cars = require(process.env.INIT_CWD + "/cars.json");
    for (var car = 0; car < cars.length; car++) {
      if (cars[car].country == country && cars[car].city == city) {
        locationCars.push(cars[car]);
      }
    }
    return locationCars;
  }
}

async function getCars(city, country, f) {
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
  var data = await getCarData(city, country);
  if (!f && data) {
    return data;
  } else if (data) {
    data = data.filter((car) => {
      var matchCompany =
        f.company.length === 0 || f.company.includes(car.rental_company);
      var matchCar = f.car.length === 0 || f.car.includes(car.name);
      var matchType = f.type.length === 0 || f.type.includes(car.body_type);
      var matchStyle = f.style.length === 0 || f.style.includes(car.style);
      var costHigherThan = car["cost"] > f.minCost;
      var costLowerThan = car["cost"] < f.maxCost;
      return (
        matchCompany &&
        matchCar &&
        matchType &&
        matchStyle &&
        costHigherThan &&
        costLowerThan
      );
    });
  }

  return data;
}

async function getInfo(topic) {
  var carInfo;
  var topicArray = [];
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      carInfo = await getCarInfoFromMongo();
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      carInfo = await getCarInfoFromPostgres();
    } else {
      carInfo = await getCarInfoFromCloudant();
    }
  } else {
    carInfo = require(process.env.INIT_CWD + "/car-info.json");
  }
  for (var car = 0; car < carInfo.length; car++) {
    if (carInfo[car][topic] && !topicArray.includes(carInfo[car][topic])) {
      topicArray.push(carInfo[car][topic]);
    }
  }
  return topicArray;
}

export { getCars, getInfo };
