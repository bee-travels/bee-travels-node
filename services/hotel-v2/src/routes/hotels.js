import { Router } from "express";
import { getHotels, getFilterList } from "../services/dataHandler";

const router = Router();

const stringToArray = (s) => s && s.split(",");

router.get("/info/:tag", async (req, res, next) => {
  const { tag } = req.params;
  try {
    const data = await getFilterList(tag);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/:country/:city", async (req, res, next) => {
  const { country, city } = req.params;
  const { superchain, hotel, type, mincost, maxcost } = req.query;

  try {
    const data = await getHotels(country, city, {
      superchain: stringToArray(superchain),
      hotel: stringToArray(hotel),
      type: stringToArray(type),
      minCost: parseInt(mincost, 10) || undefined,
      maxCost: parseInt(maxcost, 10) || undefined,
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
