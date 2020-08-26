import { Router } from "express";
import { getCountry, getCurrency } from "./../services/dataHandler";
import { getExchangeRates, convert } from "./../services/exchangeHandler";
import CountryNotFoundError from "./../errors/CountryNotFoundError";
import CurrencyNotFoundError from "./../errors/CurrencyNotFoundError";
import Jaeger from "./../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(getCountry, opossumOptions);
const exchangeBreaker = new CircuitBreaker(getExchangeRates, opossumOptions);
const convertBreaker = new CircuitBreaker(convert, opossumOptions);
const codeBreaker = new CircuitBreaker(getCurrency, opossumOptions);

// TODO: fix jaeger and replace context
const context = {};

/**
 * GET /api/v1/currency/rates
 * @tag Currency
 * @summary Get exchange rates
 * @description Get a list of all exchange rates.
 * @response 200 - OK
 * @response 500 - Internal Server Error
 * @responseExample {Jessica} 200.*\/*.Jessica
 */
router.get("/rates", async (req, res, next) => {
  // const context = new Jaeger("rates", req, res);
  try {
    const data = await exchangeBreaker.fire(context);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/currency/convert/{from}/{to}
 * @tag Currency
 * @summary Get conversion ratio
 * @description Get exchange rate for converting one currency to another.
 * @pathParam {CurrencyCode} from - The 3 digit currency code we are converting from.
 * @pathParam {CurrencyCode} to - The 3 digit currency code we are converting to.
 * @response 200 - OK
 * @response 400 - Currency Not Found Error
 * @response 500 - Internal Server Error
 */
router.get("/convert/:from/:to", async (req, res, next) => {
  // const context = new Jaeger("convert", req, res);
  const { from, to } = req.params;
  try {
    const data = await convertBreaker.fire(context, from, to);
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
 * @tag Currency
 * @summary Get countries for currency
 * @description Get a list of countries that use the provided currency code.
 * @pathParam {CurrencyCode} code - The 3 digit currency code.
 * @response 200 - OK
 * @response 400 - Currency Not Found Error
 * @response 500 - Internal Server Error
 */
router.get("/:code", async (req, res, next) => {
  // const context = new Jaeger("code", req, res);
  const { code } = req.params;
  try {
    const data = await codeBreaker.fire(code, context);
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
 * @tag Currency
 * @summary Get currency for country
 * @description Get the currency that the provided country uses.
 * @queryParam {Country} country - The full country name.
 * @response 200 - OK
 * @response 400 - Country Not Found Error
 * @response 500 - Internal Server Error
 */
router.get("/", async (req, res, next) => {
  // const context = new Jaeger("country", req, res);
  const { country } = req.query;
  if (country === undefined) {
    return next();
  }
  try {
    const data = await breaker.fire(country, context);
    return res.json(data);
  } catch (e) {
    if (e instanceof CountryNotFoundError) {
      return res.status(400).json({ error: e.message });
    }
    return next(e);
  }
});

export default router;
