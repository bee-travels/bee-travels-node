import produce from "immer";
import { types } from "./actions";
import queryString from "query-string";
import { queryToServiceFilterMap } from "./init";
import globalHistory from "globalHistory";

const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.addCarsToCart: {
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
      const index = draft.cars.indexOf(action.payload);
      if (index > -1) {
        draft.cars.splice(index, 1);
      }
      localStorage.setItem("cars", JSON.stringify(draft.cars));
      break;
    }
    case types.removeHotelsFromCart: {
      const index = draft.hotels.indexOf(action.payload);
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
      for (let [key, val] of Object.entries(draft[service])) {
        const [key2] = Object.entries(queryToServiceFilterMap).find(
          ([_k, v]) => v.service === service && v.filter === key
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
