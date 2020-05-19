import IllegalDatabaseQueryError from "./../errors/IllegalDatabaseQueryError";
const MongoClient = require("mongodb").MongoClient;

const ILLEGAL_STRING_REGEX = /\$/;

function illegalString(string) {
  const illegal = true;
  if (typeof string === "number") {
    return !illegal;
  }
  if (ILLEGAL_STRING_REGEX.test(string)) {
    return illegal;
  }
  try {
    // If we can parse the string as JSON, it's illegal.
    JSON.parse(string);
    return illegal;
  } catch {
    return !illegal;
  }
}
function isValidQueryValue(value) {
  // If the query is an array check if any items are illegal strings.
  if (value instanceof Array) {
    value.forEach((v) => {
      if (illegalString(v)) {
        throw new IllegalDatabaseQueryError(v);
      }
    });
    return value;
  }
  // Check if query is an illegal string.
  if (illegalString(value)) {
    throw new IllegalDatabaseQueryError(value);
  }
  return value;
}

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
