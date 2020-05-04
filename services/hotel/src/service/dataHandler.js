import path from "path";
import { promises as fs } from "fs";

const HOTELS_PATH = path.join(__dirname, "../../data/hotel-data.json");

const pillify = (s) => s.toLowerCase().replace(" ", "-");

async function parseMetadata(file) {
  const content = await fs.readFile(file);
  const metadata = JSON.parse(content);
  return metadata;
}

export async function getHotels(country, city, filters) {
  const { superchain, hotel, type, minCost, maxCost } = filters;
  const metadata = await parseMetadata(HOTELS_PATH);

  const hotelsData = metadata.filter((h) => {
    if (
      pillify(h.city) !== city.toLowerCase() ||
      pillify(h.country) !== country.toLowerCase()
    ) {
      return false;
    }

    return (
      (superchain === undefined || superchain.includes(h.superchain)) &&
      (hotel === undefined || hotel.includes(h.name)) &&
      (type === undefined || type.includes(h.type)) &&
      (minCost === undefined || minCost <= h.cost) &&
      (maxCost === undefined || h.cost <= maxCost)
    );
  });

  return hotelsData;
}
