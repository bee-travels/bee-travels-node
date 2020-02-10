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

COPY hotel-data.json hotel-info.json swagger.yaml ./

EXPOSE 9002

CMD ["node", "./dist/bin/www.js"]