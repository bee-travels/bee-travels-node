const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Bee Travels Destination V2 Service",
      version: "1.0.0",
      description: "Operations associated with destination data",
      license: {
        name: "Apache 2.0",
        url:
          "https://github.com/bee-travels/bee-travels-node/blob/master/LICENSE",
      },
    },
  },
  apis: ["src/routes/*.js"],
};

export default options;
