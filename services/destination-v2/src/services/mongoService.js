import fs from "fs";
import { isValidQueryValue } from "query-validator";
import { MongoClient } from "mongodb";

export function buildDestinationMongoQuery(country, city) {
  let query = {
    country: isValidQueryValue(country),
  };
  if (city) {
    query.city = isValidQueryValue(city);
  }
  return query;
}

export async function getDestinationDataFromMongo(query, context) {
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
    let collection = db.collection("destination");
    context.start("mongoQuery");
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
    context.stop();
    if (query.city !== undefined) {
      return destination;
    }
    return destinations;
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
