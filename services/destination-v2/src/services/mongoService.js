import { isValidNoSQLQueryValue } from "./queryValidationService";
const MongoClient = require("mongodb").MongoClient;

export function buildDestinationMongoQuery(country, city) {
  let query = {
    country: isValidNoSQLQueryValue(country),
  };
  if (city) {
    query.city = isValidNoSQLQueryValue(city);
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
