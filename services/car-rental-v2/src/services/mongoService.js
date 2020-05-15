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
