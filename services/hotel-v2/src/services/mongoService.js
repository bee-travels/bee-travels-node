import { isValidQueryValue } from "query-validator";
const MongoClient = require("mongodb").MongoClient;

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

export async function getHotelDataFromMongo(query) {
  const client = await MongoClient.connect(
    process.env.HOTEL_MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ).catch((err) => {
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
  const client = await MongoClient.connect(
    process.env.HOTEL_MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ).catch((err) => {
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
