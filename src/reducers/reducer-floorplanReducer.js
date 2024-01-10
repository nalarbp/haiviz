import { NEW_SVG, NEW_DATASET } from "../utils/constants";
import { initialState } from "../reducers";

const floorplanReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_SVG:
      return action.payload;
    case NEW_DATASET:
      if (action.payload.floorplan) {
        return action.payload.floorplan;
      }
      break;
    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.floorplan;
      }
  }
};

export default floorplanReducer;
