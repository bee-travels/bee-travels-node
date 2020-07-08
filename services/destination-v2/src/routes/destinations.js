import { Router } from "express";
import {
  getCities,
  getCity,
  getCitiesForCountry,
} from "./../services/dataHandler";
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";
import { IllegalDatabaseQueryError } from "query-validator";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

/**
 * GET /api/v1/destinations/{country}/{city}
 * @description Gets data associated with given destination location
 * @pathParam {string} country - Country name for destination location using slug casing (ex. united-states)
 * @pathParam {string} city - City name for destination location using slug casing (ex. new-york)
 * @response 200 - Success
 * @response 403 - Invalid query
 * @response 500 - Internal server error
 */
router.get("/:country/:city", async (req, res, next) => {
  const context = new Jaeger("city", req, res);
  const { country, city } = req.params;
  try {
    const breaker = new CircuitBreaker(getCity, opossumOptions);
    const data = await breaker.fire(country, city, context);
    res.json(data);
  } catch (e) {
    if (e instanceof IllegalDatabaseQueryError) {
      return res.status(e.status).json({ error: "Invalid query" });
    }
    next(e);
  }
});

/**
 * GET /api/v1/destinations/{country}
 * @description Gets list of destination locations for a given country from the data source
 * @pathParam {string} country - Country name for desired list of cities using slug casing (ex. united-states)
 * @response 200 - Success
 * @response 403 - Invalid query
 * @response 500 - Internal server error
 */
router.get("/:country", async (req, res, next) => {
  const context = new Jaeger("country", req, res);
  const { country } = req.params;
  try {
    const breaker = new CircuitBreaker(getCitiesForCountry, opossumOptions);
    const data = await breaker.fire(country, context);
    res.json(data);
  } catch (e) {
    if (e instanceof IllegalDatabaseQueryError) {
      return res.status(e.status).json({ error: "Invalid query" });
    }
    next(e);
  }
});

/**
 * GET /api/v1/destinations
 * @description Gets list of destination locations from the data source
 * @response 200 - Success
 * @response 403 - Invalid query
 * @response 500 - Internal server error
 */
router.get("/", async (req, res, next) => {
  const context = new Jaeger("cities", req, res);
  try {
    const breaker = new CircuitBreaker(getCities, opossumOptions);
    const data = await breaker.fire(context);
    res.json(data);
  } catch (e) {
    if (e instanceof IllegalDatabaseQueryError) {
      return res.status(e.status).json({ error: "Invalid query" });
    }
    next(e);
  }
});

export default router;
