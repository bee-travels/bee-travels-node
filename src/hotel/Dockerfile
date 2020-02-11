FROM node:10.16.1-alpine

LABEL maintainer="moficodes@gmail.com"

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY hotel-data.json hotel-info.json swagger.yaml ./

COPY src ./src

EXPOSE 9002

CMD ["npm", "start"]