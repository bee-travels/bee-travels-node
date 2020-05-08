const MongoClient = require("mongodb").MongoClient;

export async function getHotelDataFromMongo(country, city) {
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
    let query = { country: country, city: city };
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

export async function getHotelInfoFromMongo() {
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
    let collection = db.collection("hotel_info");
    let query = {};
    let res = await collection.find(query);
    let hotelsInfo = [];
    let hotelInfo;
    let hasNextHotelInfo = await res.hasNext();
    while (hasNextHotelInfo) {
      hotelInfo = await res.next();
      delete hotelInfo["_id"];
      hotelsInfo.push(hotelInfo);
      hasNextHotelInfo = await res.hasNext();
    }
    return hotelsInfo;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}
