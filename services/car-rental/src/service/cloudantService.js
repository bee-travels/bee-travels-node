const Cloudant = require("@cloudant/cloudant");

async function getCarDataFromCloudant(city, country) {
  const cloudant = Cloudant(process.env.DATABASE);
  const db = cloudant.db.use("cars");

  const res = await db.find({ selector: { city: city, country: country } });
  for (let car = 0; car < res.docs.length; car++) {
    delete res.docs[car]["_id"];
    delete res.docs[car]["_rev"];
  }
  return res.docs;
}

async function getCarInfoFromCloudant() {
  const cloudant = Cloudant(process.env.DATABASE);
  const db = cloudant.db.use("car_info");
  const dbRC = cloudant.db.use("cars");

  const res = await db.find({ selector: {} });
  const resRC = await dbRC.find({ selector: {} });
  for (let info = 0; info < res.docs.length; info++) {
    delete res.docs[info]["_id"];
    delete res.docs[info]["_rev"];
  }
  for (let rc = 0; rc < resRC.docs.length; rc++) {
    res.docs.push({ rental_company: resRC.docs[rc]["rental_company"] });
  }

  return res.docs;
}

export { getCarDataFromCloudant, getCarInfoFromCloudant };
