import fs from "fs";
import { isValidQueryValue } from "query-validator";
import { MongoClient } from "mongodb";

export function buildCarMongoQuery(country, city, filters) {
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

export async function getCarDataFromMongo(query, context) {
  let clientSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (process.env.DATABASE_CERT) {
    fs.writeFileSync("./cert.pem", process.env.DATABASE_CERT);
    clientSettings.tls = true;
    clientSettings.tlsCAFile = "./cert.pem";
  }

  context.start("mongoClientConnect");
  const client = await MongoClient.connect(
    process.env.MONGO_CONNECTION_URL,
    clientSettings
  ).catch((err) => {
    console.log(err);
  });
  context.stop();

  if (!client) {
    return;
  }

  try {
    const db = client.db("beetravels");
    let collection = db.collection("cars");
    context.start("mongoQuery");
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
    context.stop();
    return cars;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function getCarInfoFromMongo(filterType, context) {
  let clientSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (process.env.DATABASE_CERT) {
    fs.writeFileSync("./cert.pem", process.env.DATABASE_CERT);
    clientSettings.tls = true;
    clientSettings.tlsCAFile = "./cert.pem";
  }

  context.start("mongoClientConnect");
  const client = await MongoClient.connect(
    process.env.MONGO_CONNECTION_URL,
    clientSettings
  ).catch((err) => {
    console.log(err);
  });
  context.stop();

  if (!client) {
    return;
  }

  try {
    const db = client.db("beetravels");
    let collection = db.collection(
      filterType === "rental_company" ? "cars" : "car_info"
    );
    context.start("mongoQuery");
    const result = await collection.distinct(filterType);
    context.stop();
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function mongoReadinessCheck() {
  let clientSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (process.env.DATABASE_CERT) {
    fs.writeFileSync("./cert.pem", process.env.DATABASE_CERT);
    clientSettings.tls = true;
    clientSettings.tlsCAFile = "./cert.pem";
  }

  const client = await MongoClient.connect(
    process.env.MONGO_CONNECTION_URL,
    clientSettings
  ).catch((err) => {
    return false;
  });

  if (!client) {
    return false;
  }

  return true;
}
