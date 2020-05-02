/**
 * Router for currency rate conversions
 */

const { Router } = require("express");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const countryCurrencyCodeHandler = require("../services/countryCurrencyCodeHandler");
const {
  getCurrencyExchangeRates,
  convertCurrency,
} = require("../services/serviceHandler");

const router = Router();

/* GET list of currency locations */
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const data = await getCurrencyExchangeRates();
    res.json(data);
  })
);

/* POST
/search:
post:
*/
router.post(
  "/search",
  asyncMiddleware(async (req, res) => {
    const { Country, CurrencyCode } = req.body;
    if (Country) {
      const result = await countryCurrencyCodeHandler.getCurrencyNameAndCode(
        Country
      );
      return res.json(result);
    }
    if (CurrencyCode) {
      const result = await countryCurrencyCodeHandler.getCountryAndCurrencyCode(
        CurrencyCode
      );
      return res.json(result);
    }
    return res
      .status(400)
      .json({ error: "please pass in either Country or CurrencyCode" });
  })
);

/* GET
/currency/{currencyFromAmount}/{currencyFromCode}/{currencyToCode}:
*/
router.get(
  "/:currencyFromAmount/:currencyFromCode/:currencyToCode",
  asyncMiddleware(async (req, res) => {
    const { currencyFromAmount, currencyFromCode, currencyToCode } = req.params;
    if (isNaN(parseFloat(currencyFromAmount))) {
      return res
        .status(400)
        .json({ error: "currency from amount should be numeric" });
    }
    const data = await convertCurrency(
      parseFloat(currencyFromAmount.trim()),
      currencyFromCode.trim(),
      currencyToCode.trim(),
      "latest"
    );

    res.json({ result: data });
  })
);

module.exports = router;
