FROM bee-travels/node-base:v1 as release

WORKDIR /services/destination

COPY src src
COPY public public
COPY cities.csv package.json swagger.yaml ./

EXPOSE 9001

CMD ["yarn", "start"]
