import { Router } from "express";
import {
  getCities,
  getCity,
  getCitiesForCountry,
} from "./../services/dataHandler";
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(getCities, opossumOptions);
const countryBreaker = new CircuitBreaker(getCitiesForCountry, opossumOptions);
const cityCountryBreaker = new CircuitBreaker(getCity, opossumOptions);

// TODO: fix jaeger and replace context
const context = {};

/**
 * GET /api/v1/destinations/{country}/{city}
 * @tag Destination
 * @summary Get city info
 * @description Gets data associated with given destination location.
 * @pathParam {string} country - Country name for destination location using slug casing.
 * @pathParam {string} city - City name for destination location using slug casing.
 * @response 200 - OK
 * @response 500 - Internal Server Error
 */
// TODO: 400s for bad country/city see hotel/cars
router.get("/:country/:city", async (req, res, next) => {
  // const context = new Jaeger("city", req, res);
  const { country, city } = req.params;
  req.log.info(`getting destination data for -> /${country}/${city}`);

  try {
    const data = await cityCountryBreaker.fire(country, city, context);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/destinations/{country}
 * @tag Destination
 * @summary Get cities for country
 * @description Gets list of destination locations for a given country from the data source.
 * @pathParam {string} country - Country name for desired list of cities using slug casing.
 * @response 200 - OK
 * @response 500 - Internal Server Error
 */
// TODO: 400 for bad country
router.get("/:country", async (req, res, next) => {
  // const context = new Jaeger("country", req, res);
  const { country } = req.params;
  req.log.info(`getting destination data for -> /${country}`);

  try {
    const data = await countryBreaker.fire(country, context);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/destinations
 * @tag Destination
 * @summary Get all cities
 * @description Gets list of destination locations from the data source.
 * @response 200 - OK
 * @response 500 - Internal Server Error
 */
router.get("/", async (req, res, next) => {
  // const context = new Jaeger("cities", req, res);
  req.log.info(`getting destination data for -> /`);

  try {
    const data = await breaker.fire(context);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
