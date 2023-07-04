import { initialState } from ".";
import * as constant from "../utils/constants";

const selectedPreloadedDataReducer = (prevState, action) => {
  switch (action.type) {
    case constant.SELECT_PRELOADED_DATA:
      return action.payload;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.selectedPreloadedData;
      }
  }
};

export default selectedPreloadedDataReducer;
