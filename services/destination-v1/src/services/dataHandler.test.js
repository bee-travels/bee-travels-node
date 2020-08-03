import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiJsonSchema from "chai-json-schema";

chai.use(chaiJsonSchema);

const { getCities, getCity } = require("./dataHandler");

const context = {
  start: () => {},
  stop: () => {},
};

const destinationSchema = {
  title: "destination schema v1",
  type: "object",
  required: [
    "city",
    "country",
    "description",
    "latitude",
    "longitude",
    "population",
    "images",
  ],
  properties: {
    city: { type: "string" },
    country: { type: "string" },
    description: { type: "string" },
    latitude: { type: "number" },
    longitude: { type: "number" },
    population: { type: "number" },
    images: {
      type: "array",
      minItems: 3,
      items: {
        type: "string",
      },
    },
  },
};

const cityListSchema = {
  title: "city list schema v1",
  type: "array",
  items: {
    type: "object",
    required: ["city", "country"],
    properties: {
      city: { type: "string" },
      country: { type: "string" },
    },
  },
};

describe("getCities", () => {
  it("returns all cities", async () => {
    const data = await getCities(context);
    expect(data).to.have.jsonSchema(cityListSchema);
  });
});

describe("getCity", () => {
  it("returns city given valid country and city name", async () => {
    const data = await getCity("united-states", "new-york", context);
    expect(data).to.have.jsonSchema(destinationSchema);
  });
});
