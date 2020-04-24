const { Client } = require("pg");
const types = require("pg").types;

types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

async function getHotelDataFromPostgres(city, country) {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  try {
    client.connect();

    const res = await client.query(
      "SELECT * FROM hotels WHERE city='" +
        city +
        "' and country='" +
        country +
        "' "
    );
    return res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}

async function getHotelInfoFromPostgres() {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  try {
    client.connect();

    const res = await client.query(
      "SELECT DISTINCT superchain, type, name FROM hotels"
    );
    return res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}

export { getHotelDataFromPostgres, getHotelInfoFromPostgres };
