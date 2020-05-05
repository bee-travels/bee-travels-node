# Bee Travels Currency Exchange Service - Node.js

The currency exchange service is a microservice designed to convert currency values for the Bee Travels travel application using an [external API](https://exchangeratesapi.io/).

## APIs

![](screenshots/apis.jpg)

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
cd src/currencyexchange

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
http://localhost:9201 and test out this microservice API endpoints using
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
http://localhost:9201 and test out this microservice API endpoints using
the Swagger test harness page.

### Deploy to the Cloud

Bee Travels currently supports deploying to the Cloud using the following configurations:

* Helm
* K8s
* Knative

For instructions on how to deploy the currency exchange service to the Cloud, check out the [config](https://github.com/bee-travels/config) repo for the Bee Travels project.

## VSCode Extension suggestions

### Prettier - Code formatter
https://bit.ly/33e690e



[read more about Jest - a delightful JavaScript Testing Framework here](https://jestjs.io/)

moved tests out of test folder to be adjacent to files been tested - motivations:
* scale - each file should have a corresponding test file with pattern `test` or `spec`
https://kentcdodds.com/blog/colocation

uses npm lib `csvtojson` very nice as cuts down lines code drastically.

mostly using async / await over `explicit` promises.  async/await uses promises under the covers, also reduces lines of code drastically.

## Resources

[The Cost of Logging - Pino vs Winston benchmarks by Matteo Collina](https://www.nearform.com/blog/the-cost-of-logging/)
