import { NEW_LAYOUT } from "../utils/constants";
import { initialState } from "../reducers";

const layoutReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_LAYOUT:
      return action.newLayout;
    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.layout;
      }
  }
};

export default layoutReducer;
