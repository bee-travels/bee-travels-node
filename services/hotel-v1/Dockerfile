FROM bee-travels/node-base:v1 as release

WORKDIR /services/hotel-v1

COPY src src
COPY data data
COPY package.json .

EXPOSE 9101

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]