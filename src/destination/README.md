# Bee Travels Destination Service

The destination service is a microservice designed to provide information about various destination locations for the Bee Travels travel application.

# How to Run

Follow these steps to setup and run the destination service

1. [Prerequisites](#1-prerequisites)
2. [Clone the repo](#2-clone-the-repo)
3. [Test the service](#3-test-the-service)
4. [Run the service](#4-run-the-service)

## 1. Prerequisites

* [NodeJS](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)

## 2. Clone the repo

Clone the `bee-travels-node` repo locally. In a terminal, run:

```bash
git clone https://github.com/bee-travels/bee-travels-node
cd src/destination
```

## 3. Test the service

### Local

Run `npm test` from the `/src/destination` directory. If all goes well, there should be 2 passing tests.

## 4. Run the service

### Local

Run `npm install` and `npm start` from the `/src/destination` directory. In a browser, go to `localhost:4000` to interact with the destination service APIs in the swagger.

# Data

The destination data consists of the following data for various destination locations around the world:

* City name
* Latitude
* Longitude
* Country
* Population
* Description about the city
* Images of the city