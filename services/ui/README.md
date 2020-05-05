# Bee Travels Front End/UI - Node.js

The front end/UI is responsible for connecting and displaying data from the following microservices for the Bee Travels travel application:

* Destinations
* Hotels
* Currency Exchange

## Views

### Home Page

![](screenshots/home.jpg)

### Booking Page

![](screenshots/booking.jpg)

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
cd src/ui
npm install
npm start
```

In a browser, go to `localhost:9000` to interact with the front end/UI.

### Local with containers

#### Prerequisites

* [Docker for Desktop](https://www.docker.com/products/docker-desktop)

#### Steps

```bash
git clone https://github.com/bee-travels/bee-travels-node
cd src/ui
docker build -t beetravels-node-ui .
docker run -it beetravels-node-ui
```

In a browser, go to `localhost:9000` to interact with the front end/UI.

### Deploy to the Cloud

Bee Travels currently supports deploying to the Cloud using the following configurations:

* Helm
* K8s
* Knative

For instructions on how to deploy the front end/UI to the Cloud, check out the [config](https://github.com/bee-travels/config) repo for the Bee Travels project.
