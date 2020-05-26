import { Router } from "express";
import {
  getCities,
  getCity,
  getCitiesForCountry,
} from "../services/dataHandler";
import { IllegalDatabaseQueryError } from "query-validator";

const router = Router();

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
  const { country, city } = req.params;
  try {
    const data = await getCity(country, city);
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
  const { country } = req.params;
  try {
    const data = await getCitiesForCountry(country);
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
router.get("/", async (_, res, next) => {
  try {
    const data = await getCities();
    res.json(data);
  } catch (e) {
    if (e instanceof IllegalDatabaseQueryError) {
      return res.status(e.status).json({ error: "Invalid query" });
    }
    next(e);
  }
});

export default router;
