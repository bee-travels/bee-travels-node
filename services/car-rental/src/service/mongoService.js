var MongoClient = require("mongodb").MongoClient;

async function getCarDataFromMongo(city, country) {
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
    let collection = db.collection("cars");
    let query = { city: city, country: country };
    let res = await collection.find(query);
    var cars = [];
    var car;
    var hasNextCar = await res.hasNext();
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

async function getCarInfoFromMongo() {
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
    let collection = db.collection("car_info");
    let rentalCompanyCollection = db.collection("cars");
    let query = {};
    let res = await collection.find(query);
    let rentalCompanies = await rentalCompanyCollection.distinct(
      "rental_company"
    );
    var carsInfo = [];
    var carInfo;
    var hasNextCarInfo = await res.hasNext();
    while (hasNextCarInfo) {
      carInfo = await res.next();
      delete carInfo["_id"];
      carsInfo.push(carInfo);
      hasNextCarInfo = await res.hasNext();
    }
    for (
      var rentalCompany = 0;
      rentalCompany < rentalCompanies.length;
      rentalCompany++
    ) {
      carsInfo.push({ rental_company: rentalCompanies[rentalCompany] });
    }
    return carsInfo;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export { getCarDataFromMongo, getCarInfoFromMongo };
