import { NEW_SIMULATED_MAP } from "../utils/constants";
import { initialState } from "../reducers";

const simulatedMapReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_SIMULATED_MAP:
      return action.payload;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.simulatedMap;
      }
  }
};

export default simulatedMapReducer;
