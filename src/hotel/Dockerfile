FROM node:10.16.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .babelrc hotel-data.json hotel-info.json swagger.yaml ./

COPY src ./src

EXPOSE 9002

CMD ["npm", "start"]