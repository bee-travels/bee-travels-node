import { isValidNoSQLQueryValue } from "./queryValidationService";
const MongoClient = require("mongodb").MongoClient;

export function buildHotelMongoQuery(country, city, filters) {
  const { superchain, hotel, type, minCost, maxCost } = filters;
  let query = {
    country: isValidNoSQLQueryValue(country),
    city: isValidNoSQLQueryValue(city),
  };
  if (superchain) {
    query.superchain = { $in: isValidNoSQLQueryValue(superchain) };
  }
  if (hotel) {
    query.name = { $in: isValidNoSQLQueryValue(hotel) };
  }
  if (type) {
    query.type = { $in: isValidNoSQLQueryValue(type) };
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

export async function getHotelDataFromMongo(query) {
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
    let collection = db.collection("hotels");
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
    return hotels;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function getHotelInfoFromMongo(filterType) {
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
    let collection = db.collection("hotel_info");
    return await collection.distinct(filterType);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}
