import fs from "fs";
import { isValidQueryValue } from "query-validator";
import { MongoClient } from "mongodb";

export function buildHotelMongoQuery(country, city, filters) {
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

export async function getHotelDataFromMongo(query, context) {
  let clientSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (process.env.DATABASE_CERT) {
    fs.writeFileSync("./cert.pem", process.env.DATABASE_CERT);
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
    let collection = db.collection("hotels");
    context.start("mongoQuery");
    let res = await collection.find(query);
    let hotels = [];
    let hotel;
    let hasNextHotel = await res.hasNext();
    while (hasNextHotel) {
      hotel = await res.next();
      delete hotel["_id"];
      hotels.push(hotel);
      hasNextHotel = await res.hasNext();
    }
    context.stop();
    return hotels;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function getHotelInfoFromMongo(filterType, context) {
  let clientSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (process.env.DATABASE_CERT) {
    fs.writeFileSync("./cert.pem", process.env.DATABASE_CERT);
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
    let collection = db.collection("hotel_info");
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
