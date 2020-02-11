FROM node:10.16.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY public ./public

COPY cities.csv swagger.yaml ./

COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]

