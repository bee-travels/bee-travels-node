const { Client } = require("pg");

var types = require("pg").types;
types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

async function getCarDataFromPostgres(city, country) {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  try {
    client.connect();

    const res = await client.query(
      "SELECT cars.id, cars.car_id, cars.city, cars.country, cars.rental_company, cars.cost, car_info.name, car_info.body_type, car_info.style, car_info.image FROM cars INNER JOIN car_info ON cars.car_id = car_info.id WHERE city='" +
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

async function getCarInfoFromPostgres() {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  try {
    client.connect();

    const res = await client.query(
      "SELECT DISTINCT car_info.body_type, car_info.name, car_info.style, cars.rental_company FROM car_info INNER JOIN cars ON cars.car_id = car_info.id"
    );
    return res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}

export { getCarDataFromPostgres, getCarInfoFromPostgres };
