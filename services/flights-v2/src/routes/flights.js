import { Router } from "express";
import {
  getFilterList,
  getAirport,
  getAirports,
  getAirportsList,
  getDirectFlights,
  getOneStopFlights,
  getTwoStopFlights,
} from "./../services/dataHandler";
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";

import { TagNotFoundError, IllegalDateError } from "../errors";

const router = Router();

const opossumOptions = {
  timeout: 30000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

/**
 * GET /api/v1/flights/info/{filter}
 * @description Get info about flights
 * @pathParam filter info to look up
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/info/:filter", async (req, res, next) => {
  const { filter } = req.params;
  try {
    const data = await getFilterList(filter);
    res.json(data);
  } catch (e) {
    if (e instanceof TagNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

/**
 * GET /api/v1/flights/airports
 * @description Get all airports
 * @queryParam {string} [country] - Country of the rental company using slug casing (ex. united-states)
 * @queryParam {string} [city] - City of the rental company using slug casing (ex. new-york)
 * @queryParam {string} [code] - 3 Letter iata code for the airport
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/airports", async (req, res, next) => {
  const context = new Jaeger("airports", req, res);
  const { country, city, code } = req.query;
  try {
    const breaker = new CircuitBreaker(getAirports, opossumOptions);
    const data = await breaker.fire(city, country, code, context);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/flights/airports/all
 * @description Get all cities and countries we have flights from
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/airports/all", async (req, res, next) => {
  const context = new Jaeger("allAirports", req, res);
  try {
    const breaker = new CircuitBreaker(getAirportsList, opossumOptions);
    const data = await breaker.fire(context);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/flights/airports/{id}
 * @description Get airport details for a specific airport
 * @pathParam {string} id - ID of a airport
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/airports/:id", async (req, res, next) => {
  const context = new Jaeger("airport", req, res);
  const { id } = req.params;
  try {
    const breaker = new CircuitBreaker(getAirport, opossumOptions);
    const data = await breaker.fire(id, context);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/flights/direct/{from}/{to}
 * @description Get all direct flight to destination
 * @pathParam from source airport id
 * @pathParam to destination airport id
 * @queryParam {string} dateFrom - Date From
 * @queryParam {string} dateTo - Date To
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/direct/:from/:to", async (req, res, next) => {
  const context = new Jaeger("direct", req, res);
  const { from, to } = req.params;
  const { dateFrom, dateTo } = req.query;

  try {
    const _dateFrom = parseDate(dateFrom);
    const _dateTo = parseDate(dateTo);
    if (isNaN(_dateFrom) || isNaN(_dateTo)) {
      throw new IllegalDateError("needs a date");
    }
    const breaker = new CircuitBreaker(getDirectFlights, opossumOptions);
    const data = await breaker.fire(
      from,
      to,
      {
        dateFrom: _dateFrom,
        dateTo: _dateTo,
      },
      context
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/flights/onestop/{from}/{to}
 * @description Get all one stop flight to destination
 * @pathParam from source airport id
 * @pathParam to destination airport id
 * @queryParam {string} dateFrom - Date From
 * @queryParam {string} dateTo - Date To
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/onestop/:from/:to", async (req, res, next) => {
  const context = new Jaeger("onestop", req, res);
  const { from, to } = req.params;
  const { dateFrom, dateTo } = req.query;
  try {
    const _dateFrom = parseDate(dateFrom);
    const _dateTo = parseDate(dateTo);
    if (isNaN(_dateFrom) || isNaN(_dateTo)) {
      throw new IllegalDateError("needs a date");
    }
    const breaker = new CircuitBreaker(getOneStopFlights, opossumOptions);
    const data = await breaker.fire(
      from,
      to,
      {
        dateFrom: _dateFrom,
        dateTo: _dateTo,
      },
      context
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/flights/twostop/{from}/{to}
 * @description Get all two stop flight to destination
 * @pathParam from source airport id
 * @pathParam to destination airport id0
 * @queryParam {string} dateFrom - Date From
 * @queryParam {string} dateTo - Date To
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/twostop/:from/:to", async (req, res, next) => {
  const context = new Jaeger("twostop", req, res);
  const { from, to } = req.params;
  const { dateFrom, dateTo } = req.query;
  try {
    const _dateFrom = parseDate(dateFrom);
    const _dateTo = parseDate(dateTo);
    if (isNaN(_dateFrom) || isNaN(_dateTo)) {
      throw new IllegalDateError("needs a date");
    }
    const breaker = new CircuitBreaker(getTwoStopFlights, opossumOptions);
    const data = await breaker.fire(
      from,
      to,
      {
        dateFrom: _dateFrom,
        dateTo: _dateTo,
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
