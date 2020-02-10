FROM node:10.16.1-alpine as builder

WORKDIR /app

COPY package.json package-lock.json .babelrc ./

RUN npm install

COPY src ./src

RUN npm run prod-build

FROM node:10.16.1-alpine as final

WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=builder /app/dist/ dist/

RUN npm install --only=prod

COPY cities.csv swagger.yaml ./

COPY public ./public

EXPOSE 4000

CMD ["node", "./dist/bin/www.js"]