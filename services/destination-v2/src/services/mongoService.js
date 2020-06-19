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

export async function getDestinationDataFromMongo(query, jaegerTracer) {
  jaegerTracer.start("mongoClientConnect");
  const client = await MongoClient.connect(
    process.env.DESTINATION_MONGO_CONNECTION_URL,
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
    let collection = db.collection("destination");
    jaegerTracer.start("mongoQuery");
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
    jaegerTracer.stop();
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
  const client = await MongoClient.connect(
    process.env.DESTINATION_MONGO_CONNECTION_URL,
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
