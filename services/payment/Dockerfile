FROM bee-travels/node-base:v1 as release

WORKDIR /services/payment

COPY src src
COPY package.json swagger.yaml ./

EXPOSE 9403

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]
