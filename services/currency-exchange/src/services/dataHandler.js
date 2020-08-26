import path from "path";
import { promises as fs } from "fs";
import parse from "csv-parse/lib/sync";
import CSVParsingError from "./../errors/CSVParsingError";
import CountryNotFoundError from "./../errors/CountryNotFoundError";
import CurrencyNotFoundError from "./../errors/CurrencyNotFoundError";

const CSV_PATH = path.join(
  __dirname,
  "./../../data/countryCurrencyMetadata.csv"
);

async function parseMetadata(csv) {
  try {
    const content = await fs.readFile(csv);
    const metadata = parse(content, {
      columns: ["country", "currency", "code"],
    });
    return metadata;
  } catch (e) {
    throw new CSVParsingError(e.message);
  }
}

export async function getCountry(country, context) {
  // context.start("parseMetadata");
  const metadata = await parseMetadata(CSV_PATH);
  // context.stop();

  const countryInfo = metadata.find((r) => {
    if (r.country === undefined) {
      throw new CSVParsingError('No column "country".');
    }
    return r.country.toLowerCase() === country.toLowerCase();
  });

  if (countryInfo === undefined) {
    throw new CountryNotFoundError(country);
  }

  return countryInfo;
}

export async function getCurrency(code, context) {
  // context.start("parseMetadata");
  const metadata = await parseMetadata(CSV_PATH);
  // context.stop();

  // Find all countries that use requested currency.
  const allCurrencyInfo = metadata.filter((r) => {
    if (r.code === undefined) {
      throw new CSVParsingError('No column "code".');
    }
    return r.code.toLowerCase() === code.toLowerCase();
  });

  const [first] = allCurrencyInfo;
  if (first === undefined) {
    throw new CurrencyNotFoundError(code);
  }

  return {
    countries: allCurrencyInfo.map((c) => c.country),
    currency: first.currency,
    code: first.code,
  };
}
