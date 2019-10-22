FROM node:10.16.1-alpine as ui

WORKDIR /app

COPY client/package.json client/package-lock.json ./

RUN npm install

COPY client/. ./

RUN npm run build

FROM node:10.16.1-alpine as release

WORKDIR /app

COPY --from=ui /app/build client/build

COPY package*.json ./

RUN npm install

COPY index.js ./

EXPOSE 3000

CMD ["node", "index.js"]
