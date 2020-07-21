import { Router } from "express";
import { getCars, getFilterList } from "./../services/dataHandler";
import TagNotFoundError from "./../errors/TagNotFoundError";
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";
import { IllegalDatabaseQueryError } from "query-validator";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const stringToArray = (s) => s && s.split(",");

/**
 * GET /api/v1/cars/info/{filter}
 * @description Gets list of a type to filter Car Rental data by
 * @pathParam {FilterType} filter - The name of the filter to get options for
 * @response 200 - Success
 * @response 400 - Data not found
 * @response 404 - Database not found
 * @response 500 - Internal server error
 */
router.get("/info/:tag", async (req, res, next) => {
  const context = new Jaeger("info", req, res);
  const { tag } = req.params;
  req.log.info(`Getting info for ${tag}`)
  try {
    const breaker = new CircuitBreaker(getFilterList, opossumOptions);
    const data = await breaker.fire(tag, context);
    res.json(data);
  } catch (e) {
    if (e instanceof TagNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

/**
 * GET /api/v1/cars/{country}/{city}
 * @description Gets data associated with a specific city
 * @pathParam {string} country - Country of the rental company using slug casing (ex. united-states)
 * @pathParam {string} city - City of the rental company using slug casing (ex. new-york)
 * @queryParam {string} dateFrom - Date From
 * @queryParam {string} dateTo - Date To
 * @queryParam {string} [company] - Rental Company name
 * @queryParam {string} [car] - Car Name
 * @queryParam {string} [type] - Car Type
 * @queryParam {string} [style] - Car Style
 * @queryParam {number} [mincost] - Min Cost
 * @queryParam {number} [maxcost] - Max Cost
 * @response 200 - Success
 * @response 403 - Invalid query
 * @response 404 - Database not found
 * @response 500 - Internal server error
 */
router.get("/:country/:city", async (req, res, next) => {
  const context = new Jaeger("city", req, res);
  const { country, city } = req.params;
  const { company, car, type, style, mincost, maxcost, dateFrom, dateTo } = req.query;
  req.log.info(`getting car rental data for -> /${country}/${city}`)

  try {
    const breaker = new CircuitBreaker(getCars, opossumOptions);
    const data = await breaker.fire(
      country,
      city,
      {
        company: stringToArray(company),
        car: stringToArray(car),
        type: stringToArray(type),
        style: stringToArray(style),
        minCost: parseInt(mincost, 10) || undefined,
        maxCost: parseInt(maxcost, 10) || undefined,
        dateFrom: parseDate(dateFrom) || undefined,
        dateTo: parseDate(dateTo) || undefined,
      },
      context
    );
    res.json(data);
  } catch (e) {
    if (e instanceof IllegalDatabaseQueryError) {
      return res.status(e.status).json({ error: "Invalid query" });
    }
    next(e);
  }
});

function parseDate(date) {
  return Date.parse(date);
}

export default router;
