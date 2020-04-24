# Bee Travels Hotel Service - Node.js

The hotel service is a microservice designed to provide information about various hotel locations for the Bee Travels travel application.

## Data
> ***NOTE:*** All data being used is made up and used for the purpose of this demo application

The hotels used consists of the following data for various destination locations around the world:

* Superchain
* Name
* Type (luxury, comfort, budget)
* Cost
* Images of the hotel ([Hosted on IBM Cloud Cloud Object Storage](https://www.ibm.com/cloud/object-storage))

The source of the hotel service data can either be local or provided from a database. The following databases are currently supported: MongoDB, PostgreSQL, Cloudant, and CouchDB. Set the environment variable `DATABASE` to your database connection string to connect the service to your database. Check out [this](https://github.com/bee-travels/data-generator/tree/master/src/hotels) for more info on data generation and populating a database with hotel data.

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
cd src/hotel
npm install
npm start
```

In a browser, go to `localhost:9101` to interact with the hotel service APIs in the swagger.

### Local with containers

#### Prerequisites

* [Docker for Desktop](https://www.docker.com/products/docker-desktop)

#### Steps

```bash
git clone https://github.com/bee-travels/bee-travels-node
cd src/hotel
docker build -t beetravels-node-hotel .
docker run -it beetravels-node-hotel
```

In a browser, go to `localhost:9101` to interact with the hotel service APIs in the swagger.

### Deploy to the Cloud

Bee Travels currently supports deploying to the Cloud using the following configurations:

* Helm
* K8s
* Knative

For instructions on how to deploy the hotel service to the Cloud, check out the [config](https://github.com/bee-travels/config) repo for the Bee Travels project.