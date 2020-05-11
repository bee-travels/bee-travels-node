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
    },
    defintions: {
      BillingDetails: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "John Doe"
          },
          phone: {
            type: "string",
            example: "+1 (415) 777 8888"
          },
          email: {
            type: "string",
            example: null
          },
          address: {
            type: "object",
            $ref: "#/definitions/Address"
          }
        }
      },
      Charge: {
        type: "object",
        properties: {
          invoice: {
            type: "string",
            example: "invoice_73BC3"
          },
          statement_descriptor: {
            type: "string",
            minLength: 1,
            maxLength: 22,
            example: "BeeTravels.com/r/73BC3"
          },
          amount: {
            type: "number",
            format: "decimal",
            example: 499.99
          },
          currency: {
            type: "string",
            description:
              "Three-letter ISO currency code, in lowercase. Must be a supported currency.",
            example: "USD"
          },
          status: {
            type: "string",
            example: "unprocessed"
          },
          billing_details: {
            type: "object",
            $ref: "#/definitions/BillingDetails"
          },
          payment_method_details: {
            type: "object",
            $ref: "#/definitions/Card"
          }
        }
      }
    }
  },
  apis: ["src/routes/*.js"]
};

export default options;
