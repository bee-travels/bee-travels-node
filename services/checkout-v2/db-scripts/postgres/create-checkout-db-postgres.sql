CREATE DATABASE checkout;
\connect checkout;
CREATE SCHEMA IF NOT EXISTS checkout;
set search_path to chekcout;
CREATE EXTENSION pgcrypto;

  CREATE TABLE IF NOT EXISTS transactions (
      first_name VARCHAR,
      first_name VARCHAR,
      first_name VARCHAR,
      first_name VARCHAR,
      first_name VARCHAR,
      first_name VARCHAR,
      first_name VARCHAR,
      payment_confirmation VARCHAR UNIQUE,
      PRIMARY KEY (user_id)
  );
