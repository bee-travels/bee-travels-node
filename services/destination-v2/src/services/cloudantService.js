import { isValidNoSQLQueryValue } from "./queryValidationService";
const Cloudant = require("@cloudant/cloudant");

export function buildDestinationCloudantQuery(country, city) {
  let query = {
    country: isValidNoSQLQueryValue(country),
  };
  if (city) {
    query.city = isValidNoSQLQueryValue(city);
  }
  return query;
}

async function getDestinationDataFromCloudant(query) {
  const cloudant = Cloudant(process.env.COUCH_CLOUDANT_CONNECTION_URL);
  const db = cloudant.db.use("destination");

  let res = await db.find({
    selector: query,
    fields: query.city === undefined ? ["country", "city"] : [],
    limit: 200,
  });
  for (let destination = 0; destination < res.docs.length; destination++) {
    delete res.docs[destination]["_id"];
    delete res.docs[destination]["_rev"];
  }
  return res.docs;
}

export { getDestinationDataFromCloudant };
