import { Router } from "express";
import {
  getFilterList,
  getAirport,
  getAirports,
  getAirportsList,
  getDirectFlights,
  getOneStopFlights,
  getTwoStopFlights,
} from "../services/dataHandler";

import TagNotFoundError from '../errors/TagNotFoundError';

const router = Router();

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
})

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
  const { country, city, code } = req.query;
  try {
    const data = await getAirports(city, country, code);
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
  try {
    const data = await getAirportsList();
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
  const { id } = req.params;
  try {
    const data = await getAirport(id);
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
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/direct/:from/:to", async (req, res, next) => {
  console.log("REQUEST CAME HERE");
  const { from, to } = req.params;
  try {
    const data = await getDirectFlights(from, to);
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
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/onestop/:from/:to", async (req, res, next) => {
  const { from, to } = req.params;
  try {
    const data = await getOneStopFlights(from, to);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/flights/twostop/{from}/{to}
 * @description Get all two stop flight to destination
 * @pathParam from source airport id
 * @pathParam to destination airport id
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/twostop/:from/:to", async (req, res, next) => {
  const { from, to } = req.params;
  try {
    const data = await getTwoStopFlights(from, to);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
