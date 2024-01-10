import { NEW_SVG_MAPEDITOR, NEW_LOCDATA_MAPEDITOR } from "../utils/constants";
import { initialState } from "../reducers";

const mapEditorReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_SVG_MAPEDITOR:
      let newState_svgData = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.svgData) {
        newState_svgData.svgData = action.payload;
      }
      return newState_svgData;

    case NEW_LOCDATA_MAPEDITOR:
      let newState_locData = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.locationData) {
        newState_locData.locationData = action.payload;
      }
      return newState_locData;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.temporalbarSettings;
      }
  }
};

export default mapEditorReducer;
