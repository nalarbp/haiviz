import { NEW_MOVEMENT_DATA } from "../utils/constants";
import { initialState } from "../reducers";

const movementDataReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_MOVEMENT_DATA:
      return action.payload;
    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.movementData;
      }
  }
};

export default movementDataReducer;
//
