FROM node:12.16.1-alpine3.11

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY public ./public

COPY cities.csv swagger.yaml ./

COPY src ./src

EXPOSE 9001

CMD ["npm", "start"]

