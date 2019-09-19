/**
 * Service for retreiving destination location data from csv file
 */

const csv = require('fast-csv');
const fs = require('fs');

function getDestinationData(city, country) {
	const fileStream = fs.createReadStream(process.env.INIT_CWD+"/cities.csv");
	const parser = csv.parse({ headers: true });

	return new Promise(function(resolve, reject) {
		if (city) {
			var cityData;
			fileStream
    			.pipe(parser)
				.on('error', error => console.error(error))
				.on('readable', () => {
					for (let row = parser.read(); row; row = parser.read()) {
						var tempCity = JSON.parse(JSON.stringify(row)).city;
						var tempCountry = JSON.parse(JSON.stringify(row)).country;

						if (city == tempCity && country == tempCountry) {
							cityData = JSON.parse(JSON.stringify(row));
						}
					}
				})
				.on('end', () => {
						resolve(cityData);
					}
				);
		} else {
			var cities = [];

			fileStream
    			.pipe(parser)
				.on('error', error => console.error(error))
				.on('readable', () => {
					for (let row = parser.read(); row; row = parser.read()) {
						var city = JSON.parse(JSON.stringify(row)).city;
						var country = JSON.parse(JSON.stringify(row)).country;
						cities.push({city,country});
					}
				})
				.on('end', () => {
						resolve({cities: cities});
					}
				);
		}

			
	})
}

module.exports.getDestinationData = getDestinationData;
