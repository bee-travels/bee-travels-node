CREATE TABLE tUser (
	UserID serial PRIMARY KEY,
	LastName VARCHAR(64) NOT NULL,
	FirstName VARCHAR(64) NOT NULL,
	Address VARCHAR(255),
	City VARCHAR(255),
	Email VARCHAR(255) UNIQUE NOT NULL,
	CreditCard VARCHAR(40),
	created_on TIMESTAMP NOT NULL
);

CREATE TABLE tReservation (
	UserID int NOT NULL,
	ReservationUUID uuid NOT NULL,
	created_on TIMESTAMP NOT NULL,
	CONSTRAINT user_id_fkey FOREIGN KEY(UserID) 
		REFERENCES tUser (UserID) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION
);


CREATE TABLE tCar (
	CarID serial PRIMARY KEY,
	ReservationUUID uuid NOT NULL,
	Agency VARCHAR(255),
	locationAddress VARCHAR(255),
	pickupDateTime TIMESTAMP NOT NULL,
	dropoffDateTime TIMESTAMP NOT NULL,
	costUSD decimal NOT NULL,
	CONSTRAINT car_reservation_conf_fkey FOREIGN KEY(ReservationUUID) 
		REFERENCES tReservation (ReservationUUID) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION

);

CREATE TABLE tHotel (
	HotelID serial PRIMARY KEY,
	ReservationUUID uuid NOT NULL,
	HotelName VARCHAR(255),
	locationAddress VARCHAR(255),
	checkinDateTime TIMESTAMP NOT NULL,
	checkoutDateTime TIMESTAMP NOT NULL,
	costUSD decimal NOT NULL,
	CONSTRAINT car_reservation_conf_fkey FOREIGN KEY(ReservationUUID) 
		REFERENCES tReservation (ReservationUUID) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE tFlight (
	FlightID serial PRIMARY KEY,
	ReservationUUID uuid NOT NULL,
	AirlineName VARCHAR(255),
	fromAirportCode CHAR(3),
	toAirportCode CHAR(3),
	departureDateTime TIMESTAMP NOT NULL,
	arrivalDateTime TIMESTAMP NOT NULL,
	costUSD decimal NOT NULL,
	CONSTRAINT car_reservation_conf_fkey FOREIGN KEY(ReservationUUID) 
		REFERENCES tReservation (ReservationUUID) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION
);