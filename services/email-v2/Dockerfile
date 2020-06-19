FROM bee-travels/node-base:v1 as release

WORKDIR /services/email-v2

COPY src src
COPY package.json .

EXPOSE 9301

CMD ["yarn", "node", "-r", "esm", "./src/bin/www.js"]