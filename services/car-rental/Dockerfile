FROM bee-travels/node-base:v1 as release

WORKDIR /services/car-rental

COPY src src
COPY data data
COPY package.json swagger.yaml ./

EXPOSE 9102

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]
