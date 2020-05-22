import { isValidQueryValue } from "query-validator";
const Cloudant = require("@cloudant/cloudant");

export function buildCarCloudantQuery(country, city, filters) {
  const { company, car, type, style, minCost, maxCost } = filters;
  let query = {
    country: isValidQueryValue(country),
    city: isValidQueryValue(city),
  };
  if (company) {
    query.rental_company = { $in: isValidQueryValue(company) };
  }
  if (car) {
    query.name = { $in: isValidQueryValue(car) };
  }
  if (type) {
    query.body_type = { $in: isValidQueryValue(type) };
  }
  if (style) {
    query.style = { $in: isValidQueryValue(style) };
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

export async function getCarDataFromCloudant(query) {
  const cloudant = Cloudant(process.env.CAR_COUCH_CLOUDANT_CONNECTION_URL);
  const db = cloudant.db.use("cars");

  const res = await db.find({ selector: query, limit: 200 });
  for (let car = 0; car < res.docs.length; car++) {
    delete res.docs[car]["_id"];
    delete res.docs[car]["_rev"];
  }
  return res.docs;
}

export async function getCarInfoFromCloudant(filterType) {
  const cloudant = Cloudant(process.env.CAR_COUCH_CLOUDANT_CONNECTION_URL);
  const db = cloudant.db.use(
    filterType === "rental_company" ? "cars" : "car_info"
  );

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
