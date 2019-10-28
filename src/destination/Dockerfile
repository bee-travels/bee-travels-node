FROM node:10.16.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY public ./public

COPY .babelrc cities.csv swagger.yaml ./

COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]