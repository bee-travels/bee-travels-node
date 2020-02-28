FROM node:12.16.1-alpine3.11 as ui

WORKDIR /app

COPY client/package.json client/package-lock.json ./

RUN npm install

COPY client/. ./

RUN npm run build

<<<<<<< HEAD
FROM node:12.16.1-alpine3.11 as release
=======
FROM node:12.16.1-alpine as release
>>>>>>> updated ui release image to 12.16

WORKDIR /app

COPY --from=ui /app/build client/build

COPY package*.json ./

RUN npm install

COPY index.js ./

EXPOSE 9000

CMD ["node", "index.js"]
