import {useDispatch} from 'react-redux';

export const types = {addToCart: "ADD_TO_CART"};

export function useActions() {
  const dispatch = useDispatch();
  function addToCart(payload) {
    dispatch({type: types.addToCart, payload})
  }
  // add more dispatches here
  return {addToCart}
}