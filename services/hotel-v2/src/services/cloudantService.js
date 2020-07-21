import { isValidQueryValue } from "query-validator";
import Cloudant from "@cloudant/cloudant";

export function buildHotelCloudantQuery(country, city, filters) {
  const { superchain, hotel, type, minCost, maxCost } = filters;
  let query = {
    country: isValidQueryValue(country),
    city: isValidQueryValue(city),
  };
  if (superchain) {
    query.superchain = { $in: isValidQueryValue(superchain) };
  }
  if (hotel) {
    query.name = { $in: isValidQueryValue(hotel) };
  }
  if (type) {
    query.type = { $in: isValidQueryValue(type) };
  }
  if (minCost) {
    query.cost = { $gte: isValidQueryValue(minCost) };
  }
  if (maxCost) {
    if (query.cost) {
      query.cost.$lte = isValidQueryValue(maxCost);
    } else {
      query.cost = { $lte: isValidQueryValue(maxCost) };
    }
  }
  return query;
}

export async function getHotelDataFromCloudant(query, context) {
  context.start("cloudantClientConnect");
  const cloudant = Cloudant(process.env.COUCH_CLOUDANT_CONNECTION_URL);
  context.stop();
  const db = cloudant.db.use("hotels");

  context.start("cloudantQuery");
  const res = await db.find({ selector: query, limit: 200 });
  for (let hotel = 0; hotel < res.docs.length; hotel++) {
    delete res.docs[hotel]["_id"];
    delete res.docs[hotel]["_rev"];
  }
  context.stop();
  return res.docs;
}

export async function getHotelInfoFromCloudant(filterType, context) {
  context.start("cloudantClientConnect");
  const cloudant = Cloudant(process.env.COUCH_CLOUDANT_CONNECTION_URL);
  context.stop();
  const db = cloudant.db.use("hotel_info");

  context.start("cloudantQuery");
  const res = await db.find({
    selector: { _id: { $gt: null } },
    fields: [filterType],
    limit: 200,
  });
  let result = [];
  for (let filter = 0; filter < res.docs.length; filter++) {
    Object.keys(res.docs[filter]).forEach(function (key) {
      let temp = res.docs[filter][key];
      if (!result.includes(temp)) {
        result.push(temp);
      }
    });
  }
  context.stop();
  return result;
}

export async function cloudantReadinessCheck() {
  const cloudant = Cloudant(process.env.COUCH_CLOUDANT_CONNECTION_URL);
  try {
    await cloudant.ping();
  } catch (err) {
    return false;
  }
  return true;
}
