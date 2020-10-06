import produce from "immer";
import { types } from "./actions";
import queryString from "query-string";
import { queryToServiceFilterMap } from "./init";
import globalHistory from "globalHistory";

const arrayify = (maybeArray) => {
  const _maybeArray = maybeArray || [];
  if (Array.isArray(_maybeArray)) {
    return _maybeArray;
  }
  return [_maybeArray];
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.setLocation: {
      const q = queryString.parse(action.payload.search);

      for (let key of Object.keys(queryToServiceFilterMap)) {
        const { service, filter, type, default: d } = queryToServiceFilterMap[
          key
        ];
        switch (type) {
          case "array": {
            draft[service][filter] = arrayify(q[key] || d);
            break;
          }
          case "number": {
            draft[service][filter] = parseInt(q[key] || d, 10);
            break;
          }
          // NOTE: date might be needed as a case
          default: {
            draft[service][filter] = q[key] || d;
            break;
          }
        }
      }
      break;
    }
    case types.addCarsToCart: {
      console.log("REDUCER", action.payload);
      draft.cars.push(action.payload);
      localStorage.setItem("cars", JSON.stringify(draft.cars));
      break;
    }
    case types.addHotelsToCart: {
      draft.hotels.push(action.payload);
      localStorage.setItem("hotels", JSON.stringify(draft.hotels));
      break;
    }
    case types.addFlightsToCart: {
      draft.hotels.push(action.payload);
      localStorage.setItem("flights", JSON.stringify(draft.flights));
      break;
    }
    case types.removeCarsFromCart: {
      const {payload} = action;
      const compare = (store) => store.id === payload.id && store.dateFrom === payload.dateFrom && store.dateTo === payload.dateTo;
      const index = draft.cars.findIndex(compare);
      if (index > -1) {
        draft.cars.splice(index, 1);
      }
      localStorage.setItem("cars", JSON.stringify(draft.cars));
      break;
    }
    case types.removeHotelsFromCart: {
      const {payload} = action;
      const compare = (store) => store.id === payload.id && store.dateFrom === payload.dateFrom && store.dateTo === payload.dateTo;
      const index = draft.hotels.findIndex(compare);
      if (index > -1) {
        draft.hotels.splice(index, 1);
      }
      localStorage.setItem("hotels", JSON.stringify(draft.hotels));
      break;
    }
    case types.removeFlightsFromCart: {
      const index = draft.flights.indexOf(action.payload);
      if (index > -1) {
        draft.flights.splice(index, 1);
      }
      localStorage.setItem("flights", JSON.stringify(draft.flights));
      break;
    }
    case types.setFilters: {
      const { service, filter, value } = action.payload;

      draft[service][filter] = value;

      let queryObj = {};
      for (let [key, val] of Object.entries(draft.hotelFilters)) {
        const [key2] = Object.entries(queryToServiceFilterMap).find(
          ([_k, v]) => v.service === "hotelFilters" && v.filter === key
        );
        queryObj[key2] = val;
      }

      for (let [key, val] of Object.entries(draft.carFilters)) {
        const [key2] = Object.entries(queryToServiceFilterMap).find(
          ([_k, v]) => v.service === "carFilters" && v.filter === key
        );
        queryObj[key2] = val;
      }

      for (let [key, val] of Object.entries(draft.flightFilters)) {
        const [key2] = Object.entries(queryToServiceFilterMap).find(
          ([_k, v]) => v.service === "flightFilters" && v.filter === key
        );
        queryObj[key2] = val;
      }

      const query = queryString.stringify(queryObj);

      globalHistory.push(`${globalHistory.location.pathname}?${query}`);
      break;
    }
    case types.setMinMaxFilters: {
      const { service, value } = action.payload;
      // NOTE: not setting the url
      // some bug with redux dispatch unsubscribe
      draft[service].minPrice = value[0];
      draft[service].maxPrice = value[1];
      break;
    }
    default:
      break;
  }
});

export default reducer;
