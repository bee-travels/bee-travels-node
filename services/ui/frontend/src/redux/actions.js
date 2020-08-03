import { useDispatch } from "react-redux";

export const types = {
  addCarsToCart: "ADD_CARS_TO_CART",
  addHotelsToCart: "ADD_HOTELS_TO_CART",
  addFlightsToCart: "ADD_FLIGHTS_TO_CART",
  removeCarsFromCart: "REMOVE_CARS_FROM_CART",
  removeHotelsFromCart: "REMOVE_HOTELS_FROM_CART",
  removeFlightsFromCart: "REMOVE_FLIGHTS_FROM_CART",
  setFilters: "SET_FILTERS",
  setMinMaxFilters: "SET_MIN_MAX_FILTERS",
  setLocation: "SET_LOCATION",
};

export function useActions() {
  const dispatch = useDispatch();

  let actions = {};
  for (let [key, val] of Object.entries(types)) {
    actions[key] = (payload) => {
      dispatch({ type: val, payload });
    };
  }

  return {
    ...actions,
  };
}
