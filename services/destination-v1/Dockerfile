FROM bee-travels/node-base:v1 as release

WORKDIR /services/destination-v1

COPY src src
COPY data data
COPY package.json .

EXPOSE 9001

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]