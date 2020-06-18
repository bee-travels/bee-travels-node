CREATE DATABASE checkout;
\connect checkout;
CREATE SCHEMA IF NOT EXISTS checkout;
set search_path to chekcout;
CREATE EXTENSION pgcrypto;

  CREATE TABLE IF NOT EXISTS transactions (
      transaction_id VARCHAR(32) NOT NULL,
      first_name VARCHAR NOT NULL,
      last_name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      address1 VARCHAR NOT NULL,
      address2 VARCHAR,
      postal_code VARCHAR NOT NULL,
      country VARCHAR NOT NULL,
      total_cost FLOAT NOT NULL,
      currency_code CHAR(3) NOT NULL,
      time_stamp TIMESTAMP NOT NULL,
      payment_confirmation VARCHAR(32) NOT NULL UNIQUE,
      PRIMARY KEY (transaction_id)
  );

CREATE TABLE IF NOT EXISTS cart_items (
      transaction_id VARCHAR NOT NULL,
      cart_item_type VARCHAR NOT NULL,
      cart_item_uuid VARCHAR NOT NULL,
      cost FLOAT NOT NULL,
      currency_code CHAR(3) NOT NULL,
      start_date_time TIMESTAMP NOT NULL,
      end_date_time TIMESTAMP NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON UPDATE CASCADE
);
