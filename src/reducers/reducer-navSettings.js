import * as constant from "../utils/constants";
import { initialState } from "../reducers";

const mapEditorReducer = (prevState, action) => {
  switch (action.type) {
    case constant.NAV_LOCATION:
      let newState_navLoc = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.navLocation) {
        newState_navLoc.navLocation = action.payload;
      }
      return newState_navLoc;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.temporalbarSettings;
      }
  }
};

export default mapEditorReducer;
