import { Router } from "express";
import { getCountry, getCurrency } from "../services/dataHandler";
import { getExchangeRates, convert } from "../services/exchangeHandler";
import CountryNotFoundError from "../errors/CountryNotFoundError";
import CurrencyNotFoundError from "../errors/CurrencyNotFoundError";
import Jaeger from "./jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

/**
 * GET /api/v1/currency/rates
 * @description Get a list of all exchange rates.
 * @queryParam {[string]} from - TODO.
 * @response 200 - TODO.
 * @response 500 - TODO.
 * @response 400 - TODO.
 */
router.get("/rates", async (req, res, next) => {
  const jaegerTracer = new Jaeger("rates", req, res);
  try {
    const breaker = new CircuitBreaker(getExchangeRates, opossumOptions);
    const data = await breaker.fire(jaegerTracer);
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
  const jaegerTracer = new Jaeger("convert", req, res);
  const { from, to } = req.params;
  try {
    const breaker = new CircuitBreaker(convert, opossumOptions);
    const data = await breaker.fire(jaegerTracer, from, to);
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
  const jaegerTracer = new Jaeger("code", req, res);
  const { code } = req.params;
  try {
    const breaker = new CircuitBreaker(getCurrency, opossumOptions);
    const data = await breaker.fire(code, jaegerTracer);
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
  const jaegerTracer = new Jaeger("country", req, res);
  const { country } = req.query;
  if (country === undefined) {
    return next();
  }
  try {
    const breaker = new CircuitBreaker(getCountry, opossumOptions);
    const data = await breaker.fire(country, jaegerTracer);
    return res.json(data);
  } catch (e) {
    if (e instanceof CountryNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    return next(e);
  }
});

/**
 * POST /api/v1/currency
 * @description TODO.
 * @requestBody {Max} max - TODO.
 */
router.post("/", (req, res) => {
  console.log(req.body);
  res.end();
});

export default router;
