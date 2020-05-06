import { getCarDataFromMongo, getCarInfoFromMongo } from "./mongoService";
import {
  getCarDataFromPostgres,
  getCarInfoFromPostgres,
} from "./postgresService";
import {
  getCarDataFromCloudant,
  getCarInfoFromCloudant,
} from "./cloudantService";

const CARS_PATH = process.env.INIT_CWD + "/data/cars.json";
const CAR_INFO_PATH = process.env.INIT_CWD + "/data/car-info.json";

async function getCarData(city, country) {
  let cars;
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
    let locationCars = [];
    cars = require(CARS_PATH);
    for (let car = 0; car < cars.length; car++) {
      if (cars[car].country === country && cars[car].city === city) {
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
  let data = await getCarData(city, country);
  if (!f && data) {
    return data;
  } else if (data) {
    data = data.filter((car) => {
      let matchCompany =
        f.company.length === 0 || f.company.includes(car.rental_company);
      let matchCar = f.car.length === 0 || f.car.includes(car.name);
      let matchType = f.type.length === 0 || f.type.includes(car.body_type);
      let matchStyle = f.style.length === 0 || f.style.includes(car.style);
      let costHigherThan = car["cost"] > f.minCost;
      let costLowerThan = car["cost"] < f.maxCost;
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
  let carInfo;
  let topicArray = [];
  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      carInfo = await getCarInfoFromMongo();
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      carInfo = await getCarInfoFromPostgres();
    } else {
      carInfo = await getCarInfoFromCloudant();
    }
  } else {
    if (topic === "rental_company") {
      carInfo = require(CARS_PATH);
    } else {
      carInfo = require(CAR_INFO_PATH);
    }
  }
  for (let car = 0; car < carInfo.length; car++) {
    if (carInfo[car][topic] && !topicArray.includes(carInfo[car][topic])) {
      topicArray.push(carInfo[car][topic]);
    }
  }
  return topicArray;
}

export { getCars, getInfo };
