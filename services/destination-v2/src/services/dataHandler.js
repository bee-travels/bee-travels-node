import { getDestinationDataFromMongo } from "./mongoService";
import { getDestinationDataFromCloudant } from "./cloudantService";
import { getDestinationDataFromPostgres } from "./postgresService";

const JSON_PATH = process.env.INIT_CWD + "/destination.json";

async function getDestinationData(city, country) {
  let destinations;
  let cityIndex;

  if (process.env.DATABASE) {
    if (process.env.DATABASE.indexOf("mongodb") > -1) {
      destinations = await getDestinationDataFromMongo();
    } else if (process.env.DATABASE.indexOf("postgres") > -1) {
      destinations = await getDestinationDataFromPostgres();
    } else {
      destinations = await getDestinationDataFromCloudant();
    }
  } else {
    destinations = require(JSON_PATH);
  }

  if (city) {
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

    let cityData;
    for (cityIndex = 0; cityIndex < destinations.length; cityIndex++) {
      if (
        city == destinations[cityIndex].city &&
        country == destinations[cityIndex].country
      ) {
        cityData = destinations[cityIndex];
      }
    }
    return cityData;
  } else {
    let cities = [];
    let tempCity;
    let tempCountry;

    for (cityIndex = 0; cityIndex < destinations.length; cityIndex++) {
      tempCity = destinations[cityIndex].city;
      tempCountry = destinations[cityIndex].country;
      cities.push({ city: tempCity, country: tempCountry });
    }
    return { cities: cities };
  }
}

export { getDestinationData };
