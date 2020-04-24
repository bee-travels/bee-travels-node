const Cloudant = require("@cloudant/cloudant");

async function getHotelDataFromCloudant(city, country) {
  const cloudant = Cloudant(process.env.DATABASE);
  const db = cloudant.db.use("hotel");

  const res = await db.find({ selector: { city: city, country: country } });
  for (let hotel = 0; hotel < res.docs.length; hotel++) {
    delete res.docs[hotel]["_id"];
    delete res.docs[hotel]["_rev"];
  }
  return res.docs;
}

async function getHotelInfoFromCloudant() {
  const cloudant = Cloudant(process.env.DATABASE);
  const db = cloudant.db.use("hotel-info");

  const res = await db.find({ selector: {} });
  for (let info = 0; info < res.docs.length; info++) {
    delete res.docs[info]["_id"];
    delete res.docs[info]["_rev"];
  }
  return res.docs;
}

export { getHotelDataFromCloudant, getHotelInfoFromCloudant };
