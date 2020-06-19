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

export async function getHotelDataFromMongo(query, jaegerTracer) {
  jaegerTracer.start("mongoClientConnect");
  const client = await MongoClient.connect(
    process.env.HOTEL_MONGO_CONNECTION_URL,
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
    let collection = db.collection("hotels");
    jaegerTracer.start("mongoQuery");
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
    jaegerTracer.stop();
    return hotels;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function getHotelInfoFromMongo(filterType, jaegerTracer) {
  jaegerTracer.start("mongoClientConnect");
  const client = await MongoClient.connect(
    process.env.HOTEL_MONGO_CONNECTION_URL,
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
    let collection = db.collection("hotel_info");
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
    process.env.HOTEL_MONGO_CONNECTION_URL,
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
