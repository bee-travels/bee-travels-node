var MongoClient = require('mongodb').MongoClient;

async function getHotelFromMongo(city, country) {
    const client = await MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {
        const db = client.db("beetravels");
        let collection = db.collection("hotels");
        let query = { city: city, country: country }
        let res = await collection.findOne(query);
        return res;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

async function getHotelInfoFromMongo() {
    const client = await MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {
        const db = client.db("beetravels");
        let collection = db.collection("hotelinfo");
        let query = {}
        let res = await collection.findOne(query);
        return res;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

export { getHotelFromMongo, getHotelInfoFromMongo };