FROM node:12.16.1-alpine3.11

LABEL maintainer="moficodes@gmail.com"

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY hotel-data.json hotel-info.json swagger.yaml ./

COPY src ./src

EXPOSE 9002

CMD ["npm", "start"]