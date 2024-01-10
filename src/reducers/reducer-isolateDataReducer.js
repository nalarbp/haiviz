import { NEW_ISOLATE_DATA } from "../utils/constants";
import { initialState } from "../reducers";
const isolateDataReducer = (prevState, action) => {
  //console.log('#RDC-ClickedEl', action.type);
  switch (action.type) {
    case NEW_ISOLATE_DATA:
      return action.payload;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.isolateData;
      }
  }
};

export default isolateDataReducer;
//
