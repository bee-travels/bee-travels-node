import queryString from "query-string";

// will map query to service
export const queryToServiceFilterMap = {
  hsc: {
    service: "hotelFilters",
    filter: "superchains",
    type: "array",
  },
  hn: {
    service: "hotelFilters",
    filter: "names",
    type: "array",
  },
  ht: {
    service: "hotelFilters",
    filter: "types",
    type: "array",
  },
  hmin: {
    service: "hotelFilters",
    filter: "minPrice",
    type: "number",
    default: 0,
  },

  hmax: {
    service: "hotelFilters",
    filter: "maxPrice",
    type: "number",
    default: undefined,
  },
  hcur: {
    service: "hotelFilters",
    filter: "currency",
    type: "string",
    default: "USD",
  },
  hdfrom: {
    service: "hotelFilters",
    filter: "dateFrom",
    type: "date",
  },
  hdto: {
    service: "hotelFilters",
    filter: "dateTo",
    type: "date",
  },
  crc: {
    service: "carFilters",
    filter: "rentalCompanies",
    type: "array",
  },
  cn: {
    service: "carFilters",
    filter: "names",
    type: "array",
  },
  ct: {
    service: "carFilters",
    filter: "types",
    type: "array",
  },
  cs: {
    service: "carFilters",
    filter: "carStyles",
    type: "array",
  },
  cmin: {
    service: "carFilters",
    filter: "minPrice",
    type: "number",
    default: 0,
  },
  cmax: {
    service: "carFilters",
    filter: "maxPrice",
    type: "number",
    default: undefined,
  },
  ccur: {
    service: "carFilters",
    filter: "currency",
    type: "string",
    default: "USD",
  },
  cdfrom: {
    service: "carFilters",
    filter: "dateFrom",
    type: "date",
  },
  cdto: {
    service: "carFilters",
    filter: "dateTo",
    type: "date",
  },
  fa: {
    service: "flightFilters",
    filter: "airlines",
    type: "array",
  },
  fsrc: {
    service: "flightFilters",
    filter: "source",
    type: "string",
  },
  fsa: {
    service: "flightFilters",
    filter: "sourceAirport",
    type: "string",
  },
  fda: {
    service: "flightFilters",
    filter: "destinationAirport",
    type: "string",
  },
  fst: {
    service: "flightFilters",
    filter: "stops",
    type: "array",
  },
  fmin: {
    service: "flightFilters",
    filter: "minPrice",
    type: "number",
  },
  fmax: {
    service: "flightFilters",
    filter: "maxPrice",
    type: "number",
  },
  fcur: {
    service: "flightFilters",
    filter: "currency",
    type: "string",
  },
  fdfrom: {
    service: "flightFilters",
    filter: "dateFrom",
    type: "date",
  },
  fdto: {
    service: "flightFilters",
    filter: "dateTo",
    type: "date",
  },
};

const arrayify = (maybeArray) => {
  const _maybeArray = maybeArray || [];
  if (Array.isArray(_maybeArray)) {
    return _maybeArray;
  }
  return [_maybeArray];
};

export default function init() {
  // const q = queryString.parse(search);

  let cars = localStorage.getItem("cars");
  if (cars) {
    cars = JSON.parse(cars);
  }
  let hotels = localStorage.getItem("hotels");
  if (hotels) {
    hotels = JSON.parse(hotels);
  }

  let flights = localStorage.getItem("flights");
  if (flights) {
    flights = JSON.parse(flights);
  }

  let state = {
    hotels: hotels || [],
    cars: cars || [],
    flights: flights || [],
    hotelFilters: {},
    carFilters: {},
    flightFilters: {},
  };

  // for (let key of Object.keys(queryToServiceFilterMap)) {
  //   const { service, filter, type, default: d } = queryToServiceFilterMap[key];
  //   switch (type) {
  //     case "array": {
  //       state[service][filter] = arrayify(q[key] || d);
  //       break;
  //     }
  //     case "number": {
  //       state[service][filter] = parseInt(q[key] || d, 10);
  //       break;
  //     }
  //     // NOTE: date might be needed as a case
  //     default: {
  //       state[service][filter] = q[key] || d;
  //       break;
  //     }
  //   }
  // }

  // for (let [key, val] of Object.entries(q)) {
  //   const { service, filter, type } = queryToServiceFilterMap[key];
  //   switch (type) {
  //     case "array": {
  //       state[service][filter] = arrayify(val);
  //       break;
  //     }
  //     case "number": {
  //       state[service][filter] = parseInt(val, 10);
  //       break;
  //     }
  //     // NOTE: date might be needed as a case
  //     default: {
  //       state[service][filter] = val;
  //       break;
  //     }
  //   }
  // }

  return state;
}
