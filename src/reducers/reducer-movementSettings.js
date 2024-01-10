import {
  NEW_NODE_SIZE_MOVE,
  NEW_TEXT_SIZE_MOVE,
  NEW_TEXT_OFFSET_MOVE,
  NEW_RESIZE_SIGNAL_MOVE,
  IS_OVERLAPPING_LINE_SHOWN,
  IS_OVERLAPPING_LINE_SCALED,
  OVERLAPPING_LINE_SCALE_FACTOR,
  IS_SORTED_BY_SUFFIX,
  SUFFIX_SEPARATOR,
  IS_RESORT,
} from "../utils/constants";
import { initialState } from "../reducers";

const movementSettingsReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_NODE_SIZE_MOVE:
      let newState_nodeSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.nodeSize) {
        newState_nodeSize.nodeSize = action.payload;
      }
      return newState_nodeSize; // if no change return same state with before

    case NEW_TEXT_SIZE_MOVE:
      let newState_textSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textSize) {
        newState_textSize.textSize = action.payload;
      }
      return newState_textSize;

    case NEW_TEXT_OFFSET_MOVE:
      let newState_textOffset = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textOffset) {
        newState_textOffset.textOffset = action.payload;
      }
      return newState_textOffset;

    case NEW_RESIZE_SIGNAL_MOVE:
      let newState_resizeSignal = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize) {
        newState_resizeSignal.isUserStartResize = action.payload;
      }
      return newState_resizeSignal;

    case IS_OVERLAPPING_LINE_SHOWN:
      let newState_isOverlappingLineShown = Object.assign({}, prevState);
      if (action.payload !== prevState.isOverlappingLineShown) {
        newState_isOverlappingLineShown.isOverlappingLineShown = action.payload;
      }
      return newState_isOverlappingLineShown;

    case IS_OVERLAPPING_LINE_SCALED:
      let newState_isOverlappingLineScaled = Object.assign({}, prevState);
      if (action.payload !== prevState.isOverlappingLineScaled) {
        newState_isOverlappingLineScaled.isOverlappingLineScaled =
          action.payload;
      }
      return newState_isOverlappingLineScaled;

    case IS_SORTED_BY_SUFFIX:
      let newState_isSortedBySuffix = Object.assign({}, prevState);
      if (action.payload !== prevState.isSortedBySuffix) {
        newState_isSortedBySuffix.isSortedBySuffix = action.payload;
      }
      return newState_isSortedBySuffix;

    case IS_RESORT:
      let newState_isResort = Object.assign({}, prevState);
      if (action.payload !== prevState.isResort) {
        newState_isResort.isResort = action.payload;
      }
      return newState_isResort;

    case OVERLAPPING_LINE_SCALE_FACTOR:
      let newState_overlappingLineScaleFactor = Object.assign({}, prevState);
      if (action.payload !== prevState.overlappingLineScaleFactor) {
        newState_overlappingLineScaleFactor.overlappingLineScaleFactor =
          action.payload;
      }
      return newState_overlappingLineScaleFactor;

    case SUFFIX_SEPARATOR:
      let newState_suffixSeparator = Object.assign({}, prevState);
      if (action.payload !== prevState.suffixSeparator) {
        newState_suffixSeparator.suffixSeparator = action.payload;
      }
      return newState_suffixSeparator;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.movementSettings;
      }
  }
};

export default movementSettingsReducer;
