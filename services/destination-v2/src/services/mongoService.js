var MongoClient = require("mongodb").MongoClient;

async function getDestinationDataFromMongo() {
  const client = await MongoClient.connect(process.env.DATABASE, {
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
    let query = {};
    let res = await collection.find(query);
    var destinations = [];
    var destination;
    var hasNextDestination = await res.hasNext();
    while (hasNextDestination) {
      destination = await res.next();
      delete destination["_id"];
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
