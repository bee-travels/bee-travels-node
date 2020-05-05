#!/bin/bash
if [ ${TRAVIS_BRANCH} == development ]; then
  prefix=dev
else
  prefix=${TRAVIS_BRANCH}
fi

echo "prefix set to $prefix"

docker build -t bee-travels/node-base:v1 .

docker build -t beetravels/destination:${prefix}-$TRAVIS_COMMIT services/destination
docker build -t beetravels/hotel:${prefix}-$TRAVIS_COMMIT services/hotel
docker build -t beetravels/currencyexchange:${prefix}-$TRAVIS_COMMIT services/currency-exchange
docker build -t beetravels/ui:${prefix}-$TRAVIS_COMMIT services/ui

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push beetravels/destination:${prefix}-$TRAVIS_COMMIT
docker push beetravels/hotel:${prefix}-$TRAVIS_COMMIT
docker push beetravels/currencyexchange:${prefix}-$TRAVIS_COMMIT
docker push beetravels/ui:${prefix}-$TRAVIS_COMMIT
