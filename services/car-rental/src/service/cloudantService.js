var Cloudant = require("@cloudant/cloudant");

async function getCarDataFromCloudant(city, country) {
  var cloudant = Cloudant(process.env.DATABASE);
  var db = cloudant.db.use("cars");

  const res = await db.find({ selector: { city: city, country: country } });
  for (var car = 0; car < res.docs.length; car++) {
    delete res.docs[car]["_id"];
    delete res.docs[car]["_rev"];
  }
  return res.docs;
}

async function getCarInfoFromCloudant() {
  var cloudant = Cloudant(process.env.DATABASE);
  var db = cloudant.db.use("car_info");
  var dbRC = cloudant.db.use("cars");

  const res = await db.find({ selector: {} });
  const resRC = await dbRC.find({ selector: {} });
  for (var info = 0; info < res.docs.length; info++) {
    delete res.docs[info]["_id"];
    delete res.docs[info]["_rev"];
  }
  for (var rc = 0; rc < resRC.docs.length; rc++) {
    res.docs.push({ rental_company: resRC.docs[rc]["rental_company"] });
  }

  return res.docs;
}

export { getCarDataFromCloudant, getCarInfoFromCloudant };
