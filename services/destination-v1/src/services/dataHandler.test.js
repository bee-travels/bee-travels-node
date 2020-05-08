import { describe, it } from "mocha";
import { expect } from "chai";

const { getCities, getCity } = require("./dataHandler");

describe("getCities", () => {
  it("returns all cities", async () => {
    const data = await getCities();
    expect(data.length).to.equal(183);
  });
});

describe("getCity", () => {
  it("returns city given valid country and city name", async () => {
    const data = await getCity("united-states", "new-york");
    const expected = {
      city: "New York",
      country: "United States",
      description:
        "The City of New York, usually called either New York City (NYC) or simply New York (NY), is the most populous city in the United States. With an estimated 2018 population of 8,398,748 distributed over a land area of about 302.6 square miles (784 km2), New York is also the most densely populated major city in the United States. Located at the southern tip of the state of New York, the city is the center of the New York metropolitan area, the largest metropolitan area in the world by urban landmass and one of the world's most populous megacities, with an estimated 19,979,477 people in its 2018 Metropolitan Statistical Area and 22,679,948 residents in its Combined Statistical Area. A global power city, New York City has been described as the cultural, financial, and media capital of the world, and exerts a significant impact upon commerce, entertainment, research, technology, education, politics, tourism, art, fashion, and sports. The city's fast pace has inspired the term New York minute. Home to the headquarters of the United Nations, New York is an important center for international diplomacy.",
      lat: "40.6943",
      lng: "-73.9249",
      population: "19354922",
    };
    expect(data).to.deep.equal(expected);
  });
});
