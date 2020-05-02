/**
 * Service for getting metadata for
 * currency name and short
 * 3 char code by country/territory name
 * from CSV file in data dir
 * Country,CurrencyName,CurrencyCode
 *
 */
import csv from "csvtojson";
import NotFoundError from "../errors/NotFoundError";

async function readData() {
  const jsonArray = await csv({
    delimiter: ",",
  }).fromFile("./data/countryCurrencyMetadata.csv");
  return jsonArray;
}

export async function getCurrencyNameAndCode(countryName) {
  if (!countryName) {
    throw new Error("please pass in a country name");
  }

  const data = await readData();
  const countryRow = data.find(
    (row) => row.country.toLowerCase() === countryName.toLowerCase()
  );

  if (!countryRow) {
    throw new NotFoundError(`no country found for country name ${countryName}`);
  }

  return countryRow;
}

export async function getCountryAndCurrencyCode(currencyCode) {
  if (!currencyCode) {
    throw new Error("please pass in a 3 character currency code");
  }

  const data = await readData();

  const output = data
    // Find all countries that use requested currency.
    .filter(
      (row) =>
        row.currencyCode &&
        row.currencyCode.toLowerCase() === currencyCode.toLowerCase()
    )
    // Merge the countries into an array.
    .reduce((acc, item) => {
      if (acc === undefined) {
        // Embed countries in array.
        return { ...item, country: [item.country] };
      }
      // Append to countries array.
      return { ...acc, country: [...acc.country, item.country] };
    }, undefined);

  if (output === undefined) {
    throw new NotFoundError(`currency code ${currencyCode} not found`);
  }

  return output;
}
