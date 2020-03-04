FROM node:12.16.1-alpine3.11

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY ./data/countryCurrencyMetadata.csv swagger.yaml ./

COPY src ./src

EXPOSE 4001

CMD ["npm", "start"]
