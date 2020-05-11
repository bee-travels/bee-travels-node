#!/bin/bash
prefix=node
echo "prefix set to $prefix"

docker build -t bee-travels/node-base:v1 .

docker build -t beetravels/destination-v1:${prefix}-$TRAVIS_COMMIT services/destination-v1
docker build -t beetravels/destination-v2:${prefix}-$TRAVIS_COMMIT services/destination-v2
docker build -t beetravels/carrental-v2:${prefix}-$TRAVIS_COMMIT services/carrental-v2
docker build -t beetravels/hotel-v1:${prefix}-$TRAVIS_COMMIT services/hotel-v1
docker build -t beetravels/hotel-v1:${prefix}-$TRAVIS_COMMIT services/hotel-v2
docker build -t beetravels/currencyexchange:${prefix}-$TRAVIS_COMMIT services/currency-exchange
docker build -t beetravels/ui:${prefix}-$TRAVIS_COMMIT services/ui

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push beetravels/destination-v1:${prefix}-$TRAVIS_COMMIT
docker push beetravels/destination-v2:${prefix}-$TRAVIS_COMMIT
docker push beetravels/carrental-v2:${prefix}-$TRAVIS_COMMIT
docker push beetravels/hotel-v1:${prefix}-$TRAVIS_COMMIT
docker push beetravels/hotel-v2:${prefix}-$TRAVIS_COMMIT
docker push beetravels/currencyexchange:${prefix}-$TRAVIS_COMMIT
docker push beetravels/ui:${prefix}-$TRAVIS_COMMIT
