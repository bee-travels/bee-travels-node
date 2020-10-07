import { Router } from "express";
import { getCars, getFilterList, getCarByID } from "./../services/dataHandler";
import TagNotFoundError from "./../errors/TagNotFoundError";
import ItemNotFoundError from "./../errors/ItemNotFoundError";
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const infoBreaker = new CircuitBreaker(getFilterList, opossumOptions);
const idBreaker = new CircuitBreaker(getCarByID, opossumOptions);
const breaker = new CircuitBreaker(getCars, opossumOptions);

// TODO: fix jaeger and replace context
const context = {};
const stringToArray = (s) => s && s.split(",");

/**
 * GET /api/v1/cars/info/{filter}
 * @tag Car Rental
 * @summary Get filter list
 * @description Gets list of a type to filter Car Rental data by.
 * @pathParam {FilterType} filter - The name of the filter to get options for.
 * @response 200 - OK
 * @response 400 - Filter Not Found Error
 * @response 500 - Internal Server Error
 */
router.get("/info/:tag", async (req, res, next) => {
  // const context = new Jaeger("info", req, res);
  const { tag } = req.params;
  req.log.info(`Getting info for ${tag}`);
  try {
    const data = await infoBreaker.fire(tag, context);
    res.json(data);
  } catch (e) {
    if (e instanceof TagNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

/**
 * GET /api/v1/cars/{id}
 * @tag Car Rental
 * @summary Get car by id
 * @description Gets data associated with a specific car ID.
 * @pathParam {string} id - id of the car
 * @queryParam {string} dateFrom - Date From
 * @queryParam {string} dateTo - Date To
 * @response 200 - OK
 * @response 404 - not found
 * @response 500 - Internal Server Error
 */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { dateFrom, dateTo } = req.query;
  try {
    const data = await idBreaker.fire(id, {
      dateFrom: parseDate(dateFrom) || undefined,
      dateTo: parseDate(dateTo) || undefined,
    },);
    res.json(data);
  } catch (e) {
    if (e instanceof ItemNotFoundError) {
      return res.status(404).json({ error: "not found" });
    }
    next(e);
  }
});

/**
 * GET /api/v1/cars/{country}/{city}
 * @tag Car Rental
 * @summary Get list of cars
 * @description Gets data associated with a specific city.
 * @pathParam {string} country - Country of the rental company using slug casing.
 * @pathParam {string} city - City of the rental company using slug casing.
 * @queryParam {string} dateFrom - Date From
 * @queryParam {string} dateTo - Date To
 * @queryParam {string} [company] - Rental Company name.
 * @queryParam {string} [car] - Car Name.
 * @queryParam {string} [type] - Car Type.
 * @queryParam {string} [style] - Car Style.
 * @queryParam {number} [mincost] - Min Cost.
 * @queryParam {number} [maxcost] - Max Cost.
 * @response 200 - OK
 * @response 500 - Internal Server Error
 */
// TODO: throw 2 400 errors for CountryNotFound and CityNotFound for country X.
router.get("/:country/:city", async (req, res, next) => {
  // const context = new Jaeger("city", req, res);
  const { country, city } = req.params;
  const {
    company,
    car,
    type,
    style,
    mincost,
    maxcost,
    dateFrom,
    dateTo,
  } = req.query;
  req.log.info(`getting car rental data for -> /${country}/${city}`);
  try {
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
    next(e);
  }
});

function parseDate(date) {
  return Date.parse(date);
}

export default router;
