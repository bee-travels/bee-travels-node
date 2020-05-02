const MongoClient = require("mongodb").MongoClient;

async function getHotelDataFromMongo(city, country) {
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
    let collection = db.collection("hotels");
    let query = { city: city, country: country };
    let res = await collection.find(query);
    let hotels = [];
    let hotel;
    while (res.hasNext()) {
      hotel = await res.next();
      delete hotel["_id"];
      hotels.push(hotel);
    }
    return hotels;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

async function getHotelInfoFromMongo() {
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
    let collection = db.collection("hotels");
    let query = { info: { $exists: true } };
    let res = await collection.findOne(query);
    return res.info;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export { getHotelDataFromMongo, getHotelInfoFromMongo };