import { Router } from "express";
import {
  getCities,
  getCity,
  getCitiesForCountry,
} from "../services/dataHandler";
import Jaeger from "./jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

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
  const jaegerTracer = new Jaeger("city", req, res);
  const { country, city } = req.params;
  try {
    const breaker = new CircuitBreaker(getCity, opossumOptions);
    const data = await breaker.fire(country, city, jaegerTracer);
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
  const jaegerTracer = new Jaeger("country", req, res);
  const { country } = req.params;
  try {
    const breaker = new CircuitBreaker(getCitiesForCountry, opossumOptions);
    const data = await breaker.fire(country, jaegerTracer);
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
  const jaegerTracer = new Jaeger("cities", req, res);
  try {
    const breaker = new CircuitBreaker(getCities, opossumOptions);
    const data = await breaker.fire(jaegerTracer);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
