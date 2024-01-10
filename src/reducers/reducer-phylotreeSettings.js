import * as constant from "../utils/constants";
import { initialState } from "../reducers";

const phylotreeSettingsReducer = (prevState, action) => {
  switch (action.type) {
    //RESIZE SIGNAL
    case constant.RESIZE_SIGNAL_TREE:
      let newState_resizeSignal = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize) {
        newState_resizeSignal.isUserStartResize = action.payload;
      }
      return newState_resizeSignal;

    //LAYOUT
    case constant.LAYOUT_TREE:
      let newState_layout = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.layout) {
        newState_layout.layout = action.payload;
      }
      return newState_layout;

    //NODE
    case constant.IS_NODE_ALIGNED:
      let newState_isTaxaAligned = Object.assign({}, prevState);
      if (action.payload !== prevState.isTaxaAligned) {
        newState_isTaxaAligned.isTaxaAligned = action.payload;
      }
      return newState_isTaxaAligned;

    case constant.IS_DOWNLOADING_TREE:
      let newState_isDownloading = Object.assign({}, prevState);
      if (action.payload !== prevState.isDownloading) {
        newState_isDownloading.isDownloading = action.payload;
      }
      return newState_isDownloading;

    case constant.NODE_SIZE_TREE:
      let newState_nodeSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.nodeSize) {
        newState_nodeSize.nodeSize = action.payload;
      }
      return newState_nodeSize; // if no change return same state with before

    case constant.NODE_LABEL_SIZE_TREE:
      let newState_textSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textSize) {
        newState_textSize.textSize = action.payload;
      }
      return newState_textSize;

    case constant.NODE_LABEL_OFFSET_TREE:
      let newState_textOffset = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textOffset) {
        newState_textOffset.textOffset = action.payload;
      }
      return newState_textOffset;

    //SCALE
    case constant.IS_SCALE_SHOWN_TREE:
      let newState_isScaleShown = Object.assign({}, prevState);
      if (action.payload !== prevState.isScaleShown) {
        newState_isScaleShown.isScaleShown = action.payload;
      }
      return newState_isScaleShown;

    case constant.SCALE_FACTOR_TREE:
      let newState_scaleFactor = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.scaleFactor) {
        newState_scaleFactor.scaleFactor = action.payload;
      }
      return newState_scaleFactor;

    case constant.SCALE_CUSTOM_VALUE_TREE:
      let newState_scaleCustomValue = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.customScale) {
        newState_scaleCustomValue.customScale = action.payload;
      }
      return newState_scaleCustomValue;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.phylotreeSettings;
      }
  }
};

export default phylotreeSettingsReducer;
