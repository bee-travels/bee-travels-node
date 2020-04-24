FROM bee-travels/node-base:v1 as release

WORKDIR /services/hotel

COPY src src
COPY hotel-data.json hotel-info.json package.json swagger.yaml ./

EXPOSE 9101

CMD ["yarn", "start"]
