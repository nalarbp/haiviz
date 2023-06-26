import { NEW_DATASET, NEW_TRANSMISSION } from "../utils/constants";
import { initialState } from "../reducers";

const transmissionReducer = (prevState, action) => {
  //console.log('#RDC-metadata', '++:', prevState, '&&:', action);
  switch (action.type) {
    case NEW_TRANSMISSION:
      return action.payload;

    case NEW_DATASET:
      if (action.payload.transmission) {
        return action.payload.transmission;
      }
      break;
    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.transmission;
      }
  }
};

export default transmissionReducer;
