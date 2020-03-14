# Bee Travels Payment Service - Node.js

The Payment service is a microservice designed to manage Payments for the Bee Travels travel application.  

It showcases a Modern JavaScript application that has a `plugin` architecture to cater to swapping out of 2 important aspects of this microservice logic.

We include `plugins` for:
1. **Persitence layer**
> RAM bootstrap, PostGresDB and DB2.  

1. **Communication layer**
> REST and IBM MQ.  

We also demonstrate and provide documentation on how to create your own `adapters` or `plugins`


## APIs

![](readme-images/apis.jpg)

## Prerequisites
We recommended using Node Version Manager (NVM) to run various versions of Node.
if you don't have it already installed check it out [ Installing NVM here](https://github.com/nvm-sh/nvm)

Or just use Node v10.16.3 ( Which is what we used to test this service )

``` sh
node -v
v10.16.3
npm -v
6.9.0
```

## How to Run

* [Local with no containers](#local-with-no-containers)
* [Local with containers](#local-with-containers)
* [Deploy to the Cloud](#deploy-to-the-cloud)

### Local with no containers

#### Prerequisites

* [NodeJS v10+](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)

#### Steps

```sh
git clone https://github.com/bee-travels/bee-travels-node
cd src/payment

npm install

#if developing, install dev Dependacies
npm install --save-dev

#build 
npm run build

#run unittests
npm run test

#run the environment in development mode
npm run dev

#additional development commands
echo "run linter"
npm run lint

echo "run code formatter"
npm run format

#run production
npm run start
```
Then simply navigate to
http://localhost:4002 and test out this microservice API endpoints using
the Swagger test harness page.

### Local with containers

#### Prerequisites

* [Docker for Desktop](https://www.docker.com/products/docker-desktop)

#### Steps

```sh
git clone https://github.com/bee-travels/bee-travels-node
cd src/currencyexchange
docker build -t beetravels-node-currencyexchange .
docker run -it beetravels-node-currencyexchange
```

Then simply navigate to
http://localhost:4001 and test out this microservice API endpoints using
the Swagger test harness page.

### Deploy to the Cloud

Bee Travels currently supports deploying to the Cloud using the following configurations:

* Helm
* K8s
* Knative

For instructions on how to deploy the Payment service to the Cloud, check out the [config](https://github.com/bee-travels/config) repo for the Bee Travels project.

## VSCode Extension suggestions

[Prettier - Code formatter](https://bit.ly/33e690e)

[Jest - a delightful JavaScript Testing Framework here](https://jestjs.io/)

moved tests out of test folder to be adjacent to files been tested - motivations:
* scale - each file should have a corresponding test file with pattern `test` or `spec`
https://kentcdodds.com/blog/colocation

uses npm lib `csvtojson` very nice as cuts down lines code drastically.

mostly using async / await over `explicit` promises.  async/await uses promises under the covers, also reduces lines of code substancially.

## Resources

[The Cost of Logging - Pino vs Winston benchmarks by Matteo Collina](https://www.nearform.com/blog/the-cost-of-logging/)