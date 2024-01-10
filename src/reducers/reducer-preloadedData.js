import { initialState } from ".";
import * as constant from "../utils/constants";

const preloadedDataReducer = (prevState, action) => {
  switch (action.type) {
    case constant.PRELOADED_DATA:
      return action.payload;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.preloadedData;
      }
  }
};

export default preloadedDataReducer;
