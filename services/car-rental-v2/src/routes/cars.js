import { Router } from "express";
import { getCars, getFilterList } from "../services/dataHandler";
import TagNotFoundError from "../errors/TagNotFoundError";

const router = Router();

const stringToArray = (s) => s && s.split(",");

/**
 * @swagger
 *
 * /api/v1/cars/info/{tag}:
 *   get:
 *     description: Example route
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: tag
 *         description: Tag to get list of companies (tag=rental_company) OR cars (tag=name) OR car body type (tag=body_type) OR car style (tag=style)
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - rental_company
 *             - name
 *             - body_type
 *             - style
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Example Error
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
 * @swagger
 *
 * /api/v1/cars/{country}/{city}:
 *   get:
 *     description: Example route
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: country
 *         description: Country of the rental company
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: city
 *         description: City ofthe rental company
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: company
 *         description: Renatal Company name
 *         schema:
 *           type: string
 *       - in: query
 *         name: car
 *         description: Car Name
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         description: Car Type
 *         schema:
 *           type: string
 *       - in: query
 *         name: style
 *         description: Car Style
 *         schema:
 *           type: string
 *       - in: query
 *         name: mincost
 *         description: Min Cost
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxcost
 *         description: Max Cost
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Example Error
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
    next(e);
  }
});

export default router;
