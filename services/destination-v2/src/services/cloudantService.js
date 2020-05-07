var Cloudant = require("@cloudant/cloudant");

async function getDestinationDataFromCloudant() {
  var cloudant = Cloudant(process.env.DATABASE);
  var db = cloudant.db.use("destination");

  const res = await db.list({ include_docs: true });
  var destinations = [];
  for (var destination = 0; destination < res.rows.length; destination++) {
    delete res.rows[destination].doc["_id"];
    delete res.rows[destination].doc["_rev"];
    destinations.push(res.rows[destination].doc);
  }
  return destinations;
}

export { getDestinationDataFromCloudant };
