import { Router } from "express";
import {
  getData,
  getAirport,
  getAirports,
  getAirportsList,
  getDirectFlights,
  getOneStopFlights,
  getTwoStopFlights,
} from "../services/dataHandler";
import ExampleError from "../errors/ExampleError";

const router = Router();

/**
 * GET /api/v1/flights
 * @description Example route
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/", async (req, res, next) => {
  try {
    const data = await getData();
    return res.json(data);
  } catch (e) {
    if (e instanceof ExampleError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

/**
 * GET /api/v1/flights/airports/{country}/{city}
 * @description Get all airports
 * @pathParam {string} country - Country of the rental company using slug casing (ex. united-states)
 * @pathParam {string} city - City of the rental company using slug casing (ex. new-york)
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/airports/:country/:city", async (req, res, next) => {
  const { country, city } = req.params;
  try {
    const data = await getAirports(city, country);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/flights/airports
 * @description Get all cities and countries we have flights from
 * @response 200 - OK
 * @response 400 - Error
 */
router.get("/airports", async (req, res, next) => {
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
