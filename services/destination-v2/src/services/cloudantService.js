import { isValidQueryValue } from "query-validator";
import Cloudant from "@cloudant/cloudant";

export function buildDestinationCloudantQuery(country, city) {
  let query = {
    country: isValidQueryValue(country),
  };
  if (city) {
    query.city = isValidQueryValue(city);
  }
  return query;
}

export async function getDestinationDataFromCloudant(query, jaegerTracer) {
  jaegerTracer.start("cloudantClientConnect");
  const cloudant = Cloudant(
    process.env.DESTINATION_COUCH_CLOUDANT_CONNECTION_URL
  );
  jaegerTracer.stop();
  const db = cloudant.db.use("destination");

  jaegerTracer.start("cloudantQuery");
  let res = await db.find({
    selector: query,
    fields: query.city === undefined ? ["country", "city"] : [],
    limit: 200,
  });
  for (let destination = 0; destination < res.docs.length; destination++) {
    delete res.docs[destination]["_id"];
    delete res.docs[destination]["_rev"];
  }
  jaegerTracer.stop();
  return query.city === undefined ? res.docs : res.docs[0];
}

export async function cloudantReadinessCheck() {
  const cloudant = Cloudant(
    process.env.DESTINATION_COUCH_CLOUDANT_CONNECTION_URL
  );
  try {
    await cloudant.ping();
  } catch (err) {
    return false;
  }
  return true;
}
