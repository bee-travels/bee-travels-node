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

export function buildDestinationMongoQuery(country, city) {
  let query = {
    country: isValidQueryValue(country),
  };
  if (city) {
    query.city = isValidQueryValue(city);
  }
  return query;
}

async function getDestinationDataFromMongo(query) {
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
    let collection = db.collection("destination");
    let res = await collection.find(query);
    let destinations = [];
    let destination;
    let hasNextDestination = await res.hasNext();
    while (hasNextDestination) {
      destination = await res.next();
      delete destination["_id"];
      if (query.city === undefined) {
        delete destination["id"];
        delete destination["latitude"];
        delete destination["longitude"];
        delete destination["population"];
        delete destination["description"];
        delete destination["images"];
      }
      destinations.push(destination);
      hasNextDestination = await res.hasNext();
    }
    return destinations;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export { getDestinationDataFromMongo };
