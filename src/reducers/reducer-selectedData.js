import { SELECTED_DATA } from "../utils/constants";
import { initialState } from "../reducers";

const selectedDataReducer = (prevState, action) => {
  //console.log('#RDC-ClickedEl', action.type);
  switch (action.type) {
    case SELECTED_DATA:
      return action.payload;
    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.selectedData;
      }
  }
};

export default selectedDataReducer;
//
