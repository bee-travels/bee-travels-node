# Bee Travels Checkout V2 Service - Node.js

The checkout service is a microservice designed to handle the payment processing flow of an itinerary of hotels, car rentals, and flights for the Bee Travels travel application. The flow of this service is the following:

* Takes in user information for payment and items in the user's cart
* Calls payment service with user's billing information and receives a confirmation number
* Stores transaction info into a database
* Calls email service to send the user their confirmation email

## Environment Variables

* `CHECKOUT_DATABASE` - ***REQUIRED*** variable for type of database to be used. The following are acceptable values:
  * `postgres`
* `CHECKOUT_PG_HOST` - variable for the `postgres` database host
* `CHECKOUT_PG_USER` - variable for the `postgres` database user
* `CHECKOUT_PG_PASSWORD` - variable for the `postgres` database password
* `PAYMENT_URL` - ***REQUIRED*** URL for payment service
* `EMAIL_URL` - ***REQUIRED*** URL for email service

## APIs

Swagger can be accessed at the `/api-docs` endpoint

![](screenshots/apis.jpg)

## Basic Usage

* [Run](#run)
* [Test](#test)
* [Deploy to the Cloud](#deploy-to-the-cloud)

To use the checkout service navigate to the `checkout-v2` directory:

```bash
git clone https://github.com/bee-travels/bee-travels-node
cd services/checkout-v2/
```

### Run

The checkout service runs on port `9402`

#### Local without container

```bash
yarn start
```

#### Local with container

```bash
docker build -t beetravels-node-checkout-v2 .
docker run -it beetravels-node-checkout-v2
```

### Test

```bash
yarn test
```

### Deploy to the Cloud

Bee Travels currently supports deploying to the Cloud using the following configurations:

* Helm
* K8s
* OpenShift

For instructions on how to deploy the checkout service to the Cloud, check out the [config](https://github.com/bee-travels/config) repo for the Bee Travels project.
