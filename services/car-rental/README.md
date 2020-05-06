# Bee Travels Car Rental Service - Node.js

The car rental service is a microservice designed to provide information about various car rental locations for the Bee Travels travel application.

## Data
> ***NOTE:*** All data being used is made up and used for the purpose of this demo application

The car rentals used consists of the following data for various destination locations around the world:

* Company
* Name
* Body Type (sedan, hatchback, suv, crossover, muscle)
* Body Style (basic, luxury, premium)
* Cost
* Images of the cars ([Hosted on IBM Cloud Cloud Object Storage](https://www.ibm.com/cloud/object-storage))

The source of the car rental service data can either be local or provided from a database. The following databases are currently supported: MongoDB, PostgreSQL, Cloudant, and CouchDB. Set the environment variable `DATABASE` to your database connection string to connect the service to your database. Check out [this](https://github.com/bee-travels/data-generator/tree/master/src/car_rental) for more info on data generation and populating a database with car rental data.

## APIs

![](readme-images/apis.jpg)

## How to Run

* [Local with no containers](#local-with-no-containers)
* [Local with containers](#local-with-containers)
* [Deploy to the Cloud](#deploy-to-the-cloud)

### Local with no containers

#### Prerequisites

* [NodeJS v10+](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)

#### Steps

```bash
git clone https://github.com/bee-travels/bee-travels-node
cd src/carrental
npm install
npm start
```

In a browser, go to `localhost:9102` to interact with the car rental service APIs in the swagger.

### Local with containers

#### Prerequisites

* [Docker for Desktop](https://www.docker.com/products/docker-desktop)

#### Steps

```bash
git clone https://github.com/bee-travels/bee-travels-node
cd src/carrental
docker build -t beetravels-node-carrental .
docker run -it beetravels-node-carrental
```

In a browser, go to `localhost:9102` to interact with the car rental service APIs in the swagger.

### Deploy to the Cloud

Bee Travels currently supports deploying to the Cloud using the following configurations:

* Helm
* K8s
* Knative

For instructions on how to deploy the hotel service to the Cloud, check out the [config](https://github.com/bee-travels/config) repo for the Bee Travels project.