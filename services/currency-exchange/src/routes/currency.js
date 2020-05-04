import { Router } from "express";
import { getCountry, getCurrency } from "../services/infoHandler";
import { getExchangeRates, convert } from "../services/exchangeHandler";
import CountryNotFoundError from "../errors/CountryNotFoundError";
import CurrencyNotFoundError from "../errors/CurrencyNotFoundError";

const router = Router();

router.get("/rates", async (_, res, next) => {
  try {
    const data = await getExchangeRates();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/convert/:from/:to", async (req, res, next) => {
  const { from, to } = req.params;
  try {
    const data = await convert(from, to);
    res.json({ rate: data });
  } catch (e) {
    if (e instanceof CurrencyNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

router.get("/:code", async (req, res, next) => {
  const { code } = req.params;
  try {
    const data = await getCurrency(code);
    return res.json(data);
  } catch (e) {
    if (e instanceof CurrencyNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  const { country } = req.query;
  if (country === undefined) {
    next();
  }
  try {
    const data = await getCountry(country);
    return res.json(data);
  } catch (e) {
    if (e instanceof CountryNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

export default router;
