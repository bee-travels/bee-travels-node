import { isValidQueryValue } from "query-validator";

export function buildCheckoutSaveDb2Statement(checkout_object, payment_confirm) {

  const current_date = Date.now();
  const statement = 'INSERT INTO checkout.transaction(first_name, last_name, email, street, country, created) \
                                          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *'
  const values = [isValidQueryValue(checkout_object.first_name), isValidQueryValue(checkout_object.last_name), isValidQueryValue(checkout_object.email), isValidQueryValue(checkout_object.line1), isValidQueryValue(checkout_object.line2), isValidQueryValue(checkout_object.country), current_date]
  return { statement: statement, values: values };
}

export async function checkoutSaveDb2(query) {
  const client = new Client({
    host: process.env.CHECKOUT_PG_HOST,
    user: process.env.CHECKOUT_PG_USER,
    password: process.env.CHECKOUT_PG_PASSWORD,
    database: "checkout",
  });

  try {
    client.connect();
    const res = await client.query(query.statement, query.values);
    return res.rows;
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
}
