import { Router } from "express";
import {
  getCities,
  getCity,
  getCitiesForCountry,
} from "../services/dataHandler";

const router = Router();

router.get("/:country/:city", async (req, res, next) => {
  const { country, city } = req.params;
  try {
    const data = await getCity(country, city);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/:country", async (req, res, next) => {
  const { country } = req.params;
  try {
    const data = await getCitiesForCountry(country);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (_, res, next) => {
  try {
    const data = await getCities();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
