const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Bee Travels Currency Exchange Service",
      version: "1.0.0",
      description: "replace this with a real description of your service",
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
  },
  apis: ["src/routes/*.js"],
};

export default options;
