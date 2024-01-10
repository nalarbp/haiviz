import {
  NEW_NODE_SIZE_MAP,
  NEW_TEXT_SIZE_MAP,
  NEW_TEXT_OFFSET_MAP,
  NEW_RESIZE_SIGNAL_MAP,
  NEW_LAYOUT_MAP,
  NEW_IS_LOC_TEXT_SHOWN_MAP
} from "../utils/constants";
import { initialState } from "../reducers";

const localmapSettingsReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_NODE_SIZE_MAP:
      let newState_nodeSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.nodeSize) {
        newState_nodeSize.nodeSize = action.payload;
      }
      return newState_nodeSize; // if no change return same state with before

    case NEW_TEXT_SIZE_MAP:
      let newState_textSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textSize) {
        newState_textSize.textSize = action.payload;
      }
      return newState_textSize;

    case NEW_TEXT_OFFSET_MAP:
      let newState_textOffset = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textOffset) {
        newState_textOffset.textOffset = action.payload;
      }
      return newState_textOffset;

    case NEW_RESIZE_SIGNAL_MAP:
      let newState_resizeSignal = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize) {
        newState_resizeSignal.isUserStartResize = action.payload;
      }
      return newState_resizeSignal;

    case NEW_LAYOUT_MAP:
      let newState_layout = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.layout) {
        newState_layout.layout = action.payload;
      }
      return newState_layout;

    case NEW_IS_LOC_TEXT_SHOWN_MAP:
      let newState_isLocTextShown = Object.assign({}, prevState);
      if (action.payload !== prevState.isLocTextShown) {
        newState_isLocTextShown.isLocTextShown = action.payload;
      }
      return newState_isLocTextShown;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.localmapSettings;
      }
  }
};

export default localmapSettingsReducer;
