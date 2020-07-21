import produce from "immer";
import { types } from "./actions";

const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.addToCart: {
      draft.cars.push(action.payload);
      localStorage.setItem("cars", JSON.stringify(draft.cars));

      break;
    }
    default:
      break;
  }
});

export default reducer;
