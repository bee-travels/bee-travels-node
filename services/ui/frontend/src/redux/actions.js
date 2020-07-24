import { useDispatch } from "react-redux";

export const types = {
  addCarsToCart: "ADD_CARS_TO_CART",
  addHotelsToCart: "ADD_HOTELS_TO_CART",
  addFlightsToCart: "ADD_FLIGHTS_TO_CART",
  removeCarsFromCart: "REMOVE_CARS_FROM_CART",
  removeHotelsFromCart: "REMOVE_HOTELS_FROM_CART",
  removeFlightsFromCart: "REMOVE_FLIGHTS_FROM_CART",
};

export function useActions() {
  const dispatch = useDispatch();
  function addCarsToCart(payload) {
    dispatch({ type: types.addCarsToCart, payload });
  }
  function addHotelsToCart(payload) {
    dispatch({ type: types.addHotelsToCart, payload });
  }
  function addFlightsToCart(payload) {
    dispatch({ type: types.addFlightsToCart, payload });
  }

  function removeCarsFromCart(payload) {
    dispatch({ type: types.removeCarsFromCart, payload });
  }
  function removeHotelsFromCart(payload) {
    dispatch({ type: types.removeHotelsFromCart, payload });
  }
  function removeFlightsFromCart(payload) {
    dispatch({ type: types.removeFlightsFromCart, payload });
  }
  // add more dispatches here
  return {
    addCarsToCart,
    addHotelsToCart,
    addFlightsToCart,
    removeCarsFromCart,
    removeHotelsFromCart,
    removeFlightsFromCart,
  };
}
