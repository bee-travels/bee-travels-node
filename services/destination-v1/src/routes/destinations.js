import { Router } from "express";
import {
  getCities,
  getCity,
  getCitiesForCountry,
} from "../services/dataHandler";

const router = Router();

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
  const { country, city } = req.params;
  try {
    const data = await getCity(country, city);
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
  const { country } = req.params;
  try {
    const data = await getCitiesForCountry(country);
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
router.get("/", async (_, res, next) => {
  try {
    const data = await getCities();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
