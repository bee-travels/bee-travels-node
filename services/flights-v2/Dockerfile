FROM bee-travels/node-base:v1 as release

WORKDIR /services/flights-v2

COPY src src
COPY package.json .

EXPOSE 9103

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]