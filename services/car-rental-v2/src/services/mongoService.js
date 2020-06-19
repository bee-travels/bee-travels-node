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

export async function getCarDataFromMongo(query, jaegerTracer) {
  jaegerTracer.start("mongoClientConnect");
  const client = await MongoClient.connect(
    process.env.CAR_MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ).catch((err) => {
    console.log(err);
  });
  jaegerTracer.stop();

  if (!client) {
    return;
  }

  try {
    const db = client.db("beetravels");
    let collection = db.collection("cars");
    jaegerTracer.start("mongoQuery");
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
    jaegerTracer.stop();
    return cars;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function getCarInfoFromMongo(filterType, jaegerTracer) {
  jaegerTracer.start("mongoClientConnect");
  const client = await MongoClient.connect(
    process.env.CAR_MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ).catch((err) => {
    console.log(err);
  });
  jaegerTracer.stop();

  if (!client) {
    return;
  }

  try {
    const db = client.db("beetravels");
    let collection = db.collection(
      filterType === "rental_company" ? "cars" : "car_info"
    );
    jaegerTracer.start("mongoQuery");
    const result = await collection.distinct(filterType);
    jaegerTracer.stop();
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function mongoReadinessCheck() {
  const client = await MongoClient.connect(
    process.env.CAR_MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ).catch((err) => {
    return false;
  });

  if (!client) {
    return false;
  }

  return true;
}
