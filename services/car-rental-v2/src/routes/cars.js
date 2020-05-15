import { Router } from "express";
import { getCars, getFilterList } from "../services/dataHandler";
import TagNotFoundError from "../errors/TagNotFoundError";
import IllegalDatabaseQueryError from "../errors/IllegalDatabaseQueryError";

const router = Router();

const stringToArray = (s) => s && s.split(",");

/**
 * GET /api/v1/cars/info/{filter}
 * @description Example route
 * @pathParam {FilterType} filter - The name of the filter to get options for.
 * @response 200 - Success.
 * @response 400 - Example Error.
 */
router.get("/info/:tag", async (req, res, next) => {
  const { tag } = req.params;
  try {
    const data = await getFilterList(tag);
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
 * @description Example route
 * @pathParam {string} country - Country of the rental company.
 * @pathParam {string} city - City of the rental company.
 * @queryParam {[string]} company - Rental Company name
 * @queryParam {[string]} car - Car Name
 * @queryParam {[string]} type - Car Type
 * @queryParam {[string]} style - Car Style
 * @queryParam {[number]} mincost - Min Cost
 * @queryParam {[number]} maxcost - Max Cost
 * @response 200 - Success.
 * @response 400 - Example Error.
 */
router.get("/:country/:city", async (req, res, next) => {
  const { country, city } = req.params;
  const { company, car, type, style, mincost, maxcost } = req.query;

  try {
    const data = await getCars(country, city, {
      company: stringToArray(company),
      car: stringToArray(car),
      type: stringToArray(type),
      style: stringToArray(style),
      minCost: parseInt(mincost, 10) || undefined,
      maxCost: parseInt(maxcost, 10) || undefined,
    });
    res.json(data);
  } catch (e) {
    if (e instanceof IllegalDatabaseQueryError) {
      return res.status(e.status).json({ error: "Invalid query" });
    }
    next(e);
  }
});

export default router;
