import * as constant from "../utils/constants";
import { initialState } from "../reducers";

const phylotreeGanttSettingsReducer = (prevState, action) => {
  switch (action.type) {
    //RESIZE SIGNAL
    case constant.RESIZE_SIGNAL_TREEGANTT:
      let newState_resizeSignal = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize) {
        newState_resizeSignal.isUserStartResize = action.payload;
      }
      return newState_resizeSignal;

    //WIDTH PERCENT

    //NODE
    case constant.NODE_SIZE_TREEGANTT:
      let newState_nodeSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.nodeSize) {
        newState_nodeSize.nodeSize = action.payload;
      }
      return newState_nodeSize; // if no change return same state with before

    case constant.NODE_LABEL_SIZE_TREEGANTT:
      let newState_textSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textSize) {
        newState_textSize.textSize = action.payload;
      }
      return newState_textSize;

    case constant.NODE_LABEL_OFFSET_TREEGANTT:
      let newState_textOffset = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textOffset) {
        newState_textOffset.textOffset = action.payload;
      }
      return newState_textOffset;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.phylotreeSettings;
      }
  }
};

export default phylotreeGanttSettingsReducer;
