const { Client } = require("pg");

let types = require("pg").types;
types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

export async function getHotelDataFromPostgres(country, city) {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  try {
    client.connect();

    const res = await client.query(
      "SELECT hotels.id, hotels.hotel_id, hotels.city, hotels.country, hotels.cost, hotels.images, hotel_info.superchain, hotel_info.type, hotel_info.name FROM hotels INNER JOIN hotel_info ON hotels.hotel_id = hotel_info.id WHERE city='" +
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

export async function getHotelInfoFromPostgres() {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  try {
    client.connect();

    const res = await client.query(
      "SELECT DISTINCT superchain, type, name FROM hotel_info"
    );
    return res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}
