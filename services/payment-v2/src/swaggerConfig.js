const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Bee Travels Payment Service ",
      version: "1.0.0",
      description: "Basic responder Bee Travels Payment stub",
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html"
      }
    }
  },
  apis: ["src/routes/*.?(js|yaml|yml)"]
};

export default options;
