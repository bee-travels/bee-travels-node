CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(32) NOT NULL,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    address1 VARCHAR(64) NOT NULL,
    address2 VARCHAR(64),
    postal_code VARCHAR(16) NOT NULL,
    country VARCHAR(32) NOT NULL,
    total_cost FLOAT NOT NULL,
    currency_code CHAR(3) NOT NULL,
    time_stamp TIMESTAMP NOT NULL,
    payment_confirmation VARCHAR(32) NOT NULL UNIQUE,
    PRIMARY KEY (transaction_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    transaction_id VARCHAR(32) NOT NULL,
    cart_item_type VARCHAR(8) NOT NULL,
    cart_item_uuid VARCHAR(32) NOT NULL,
    cost FLOAT NOT NULL,
    currency_code CHAR(3) NOT NULL,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    FOREIGN KEY (transaction_id) 
      REFERENCES transactions(transaction_id) 
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
