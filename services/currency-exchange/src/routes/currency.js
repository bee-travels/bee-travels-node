import { Router } from "express";
import { getCountry, getCurrency } from "../services/dataHandler";
import { getExchangeRates, convert } from "../services/exchangeHandler";
import CountryNotFoundError from "../errors/CountryNotFoundError";
import CurrencyNotFoundError from "../errors/CurrencyNotFoundError";

const router = Router();

/**
 * GET /api/v1/currency/rates
 * @description Get a list of all exchange rates.
 * @queryParam {[string]} from - TODO.
 * @response 200 - TODO.
 * @response 500 - TODO.
 * @response 400 - TODO.
 */
router.get("/rates", async (_, res, next) => {
  try {
    const data = await getExchangeRates();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/currency/convert/{from}/{to}
 * @description Get exchange rate for converting one currency to another.
 * @pathParam {string} from - TODO.
 * @pathParam {string} to - TODO.
 */
router.get("/convert/:from/:to", async (req, res, next) => {
  const { from, to } = req.params;
  try {
    const data = await convert(from, to);
    return res.json({ rate: data });
  } catch (e) {
    if (e instanceof CurrencyNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    return next(e);
  }
});

/**
 * GET /api/v1/currency/{code}
 * @description TODO.
 * @pathParam {string} code - TODO.
 */
router.get("/:code", async (req, res, next) => {
  const { code } = req.params;
  try {
    const data = await getCurrency(code);
    return res.json(data);
  } catch (e) {
    if (e instanceof CurrencyNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    return next(e);
  }
});

/**
 * GET /api/v1/currency
 * @description TODO.
 * @queryParam {string} country - TODO.
 */
router.get("/", async (req, res, next) => {
  const { country } = req.query;
  if (country === undefined) {
    return next();
  }
  try {
    const data = await getCountry(country);
    return res.json(data);
  } catch (e) {
    if (e instanceof CountryNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    return next(e);
  }
});

export default router;
