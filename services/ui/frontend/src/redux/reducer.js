import produce from "immer";
import { types } from "./actions";

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
    default:
      break;
  }
});

export default reducer;
