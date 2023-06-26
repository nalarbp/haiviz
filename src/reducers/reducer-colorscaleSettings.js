import * as constant from "../utils/constants";
import { initialState } from "../reducers";

const colorscaleSettingsReducer = (prevState, action) => {
  switch (action.type) {
    case constant.NEW_NODE_SIZE_COLOR:
      let newState_nodeSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.nodeSize) {
        newState_nodeSize.nodeSize = action.payload;
      }
      return newState_nodeSize; // if no change return same state with before

    case constant.NEW_TEXT_SIZE_COLOR:
      let newState_textSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textSize) {
        newState_textSize.textSize = action.payload;
      }
      return newState_textSize;

    case constant.NEW_TEXT_OFFSET_COLOR:
      let newState_textOffset = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textOffset) {
        newState_textOffset.textOffset = action.payload;
      }
      return newState_textOffset;

    case constant.COLOR_IS_DOWNLOADING:
      let newState_isDownloading = Object.assign({}, prevState);
      if (action.payload !== prevState.isDownloading) {
        newState_isDownloading.isDownloading = action.payload;
      }
      return newState_isDownloading;

    case constant.NEW_RESIZE_SIGNAL_COLOR:
      let newState_resizeSignal = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize) {
        newState_resizeSignal.isUserStartResize = action.payload;
      }
      return newState_resizeSignal;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.colorscaleSettings;
      }
  }
};

export default colorscaleSettingsReducer;
