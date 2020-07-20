FROM bee-travels/node-base:v1 as release

WORKDIR /services/checkout-v2

COPY src src
COPY package.json .

EXPOSE 9402

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]