import { isValidQueryValue } from "query-validator";
const Cloudant = require("@cloudant/cloudant");

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

export async function getHotelDataFromCloudant(query) {
  const cloudant = Cloudant(process.env.HOTEL_COUCH_CLOUDANT_CONNECTION_URL);
  const db = cloudant.db.use("hotels");

  const res = await db.find({ selector: query, limit: 200 });
  for (let hotel = 0; hotel < res.docs.length; hotel++) {
    delete res.docs[hotel]["_id"];
    delete res.docs[hotel]["_rev"];
  }
  return res.docs;
}

export async function getHotelInfoFromCloudant(filterType) {
  const cloudant = Cloudant(process.env.HOTEL_COUCH_CLOUDANT_CONNECTION_URL);
  const db = cloudant.db.use("hotel_info");

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
  return result;
}
