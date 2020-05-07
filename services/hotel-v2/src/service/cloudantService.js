const Cloudant = require("@cloudant/cloudant");

export async function getHotelDataFromCloudant(country, city) {
  const cloudant = Cloudant(process.env.DATABASE);
  const db = cloudant.db.use("hotels");

  const res = await db.find({ selector: { country: country, city: city } });
  for (let hotel = 0; hotel < res.docs.length; hotel++) {
    delete res.docs[hotel]["_id"];
    delete res.docs[hotel]["_rev"];
  }
  return res.docs;
}

export async function getHotelInfoFromCloudant() {
  const cloudant = Cloudant(process.env.DATABASE);
  const db = cloudant.db.use("hotel_info");

  const res = await db.find({ selector: {} });
  for (let info = 0; info < res.docs.length; info++) {
    delete res.docs[info]["_id"];
    delete res.docs[info]["_rev"];
  }
  return res.docs;
}
