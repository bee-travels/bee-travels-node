FROM bee-travels/node-base:v1 as release

WORKDIR /services/destination-v2

COPY src src
COPY data data
COPY package.json swagger.yaml ./

EXPOSE 9001

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]
