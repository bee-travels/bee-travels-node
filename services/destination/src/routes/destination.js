import { Router } from "express";
import axios from "axios";
import {
  getCities,
  getCity,
  getCitiesForCountry,
} from "../services/dataHandler";

const router = Router();

router.get("/images/*", async (req, res, next) => {
  try {
    const stream = await axios({
      method: "get",
      url: `http://s3.us.cloud-object-storage.appdomain.cloud/bee-travels-destination/${req.params[0]}`,
      responseType: "stream",
    });
    stream.data.pipe(res).on("error", (e) => {
      next(e);
    });
  } catch (e) {
    next(e);
  }
});

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
