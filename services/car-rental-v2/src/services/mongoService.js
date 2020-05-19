import { isValidNoSQLQueryValue } from "./queryValidationService";
const MongoClient = require("mongodb").MongoClient;

export function buildCarMongoQuery(country, city, filters) {
  const { company, car, type, style, minCost, maxCost } = filters;
  let query = {
    country: isValidNoSQLQueryValue(country),
    city: isValidNoSQLQueryValue(city),
  };
  if (company) {
    query.rental_company = { $in: isValidNoSQLQueryValue(company) };
  }
  if (car) {
    query.name = { $in: isValidNoSQLQueryValue(car) };
  }
  if (type) {
    query.body_type = { $in: isValidNoSQLQueryValue(type) };
  }
  if (style) {
    query.style = { $in: isValidNoSQLQueryValue(style) };
  }
  if (minCost) {
    query.cost = { $gte: isValidNoSQLQueryValue(minCost) };
  }
  if (maxCost) {
    if (query.cost) {
      query.cost.$lte = isValidNoSQLQueryValue(maxCost);
    } else {
      query.cost = { $lte: isValidNoSQLQueryValue(maxCost) };
    }
  }
  return query;
}

export async function getCarDataFromMongo(query) {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(err);
  });

  if (!client) {
    return;
  }

  try {
    const db = client.db("beetravels");
    let collection = db.collection("cars");
    let res = await collection.find(query);
    let cars = [];
    let car;
    let hasNextCar = await res.hasNext();
    while (hasNextCar) {
      car = await res.next();
      delete car["_id"];
      cars.push(car);
      hasNextCar = await res.hasNext();
    }
    return cars;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function getCarInfoFromMongo(filterType) {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(err);
  });

  if (!client) {
    return;
  }

  try {
    const db = client.db("beetravels");
    let collection = db.collection(
      filterType === "rental_company" ? "cars" : "car_info"
    );
    return await collection.distinct(filterType);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}
