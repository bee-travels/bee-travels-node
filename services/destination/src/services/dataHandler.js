/**
 * Service for retreiving destination location data from csv file
 */

import { parse } from "fast-csv";
import { createReadStream } from "fs";

function getDestinationData(city, country) {
  const fileStream = createReadStream(process.env.INIT_CWD + "/cities.csv");
  const parser = parse({ headers: true });

  return new Promise(function (resolve) {
    if (city) {
      let cityData;
      fileStream
        .pipe(parser)
        .on("error", (error) => console.error(error))
        .on("readable", () => {
          for (let row = parser.read(); row; row = parser.read()) {
            const tempCity = JSON.parse(JSON.stringify(row)).city;
            const tempCountry = JSON.parse(JSON.stringify(row)).country;

            if (city === tempCity && country === tempCountry) {
              cityData = JSON.parse(JSON.stringify(row));
            }
          }
        })
        .on("end", () => {
          resolve(cityData);
        });
    } else {
      let cities = [];

      fileStream
        .pipe(parser)
        .on("error", (error) => console.error(error))
        .on("readable", () => {
          for (let row = parser.read(); row; row = parser.read()) {
            const city = JSON.parse(JSON.stringify(row)).city;
            const country = JSON.parse(JSON.stringify(row)).country;
            cities.push({ city, country });
          }
        })
        .on("end", () => {
          resolve({ cities: cities });
        });
    }
  });
}

export { getDestinationData };
