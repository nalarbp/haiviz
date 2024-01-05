import * as constant from "../utils/constants";
import { initialState } from "../reducers";

const transgraphSettingsReducer = (prevState, action) => {
  switch (action.type) {
    case constant.IS_DOWNLOADING_TRANS:
      let newState_transgraphIsDownloading = Object.assign({}, prevState);
      if (action.payload !== prevState.transgraphIsDownloading) {
        newState_transgraphIsDownloading.transgraphIsDownloading =
          action.payload;
      }
      return newState_transgraphIsDownloading; // if no change return same state with before

    // case constant.NODE_SIZE_TRANS:
    //   let newState_nodeSize = Object.assign({}, prevState);
    //   if (action.payload && action.payload !== prevState.nodeSize) {
    //     newState_nodeSize.nodeSize = action.payload;
    //   }
    //   return newState_nodeSize; // if no change return same state with before

    // case constant.TEXT_SIZE_TRANS:
    //   let newState_textSize = Object.assign({}, prevState);
    //   if (action.payload && action.payload !== prevState.textSize) {
    //     newState_textSize.textSize = action.payload;
    //   }
    //   return newState_textSize;

    // case constant.LINK_LABEL_SIZE_TRANS:
    //   let newState_linkLabelSize = Object.assign({}, prevState);
    //   if (action.payload !== prevState.linkLabelSize) {
    //     newState_linkLabelSize.linkLabelSize = action.payload;
    //   }
    //   return newState_linkLabelSize;

    case constant.KEY_TRANS:
      let newState_layoutKey = Object.assign({}, prevState);
      if (action.payload !== prevState.layoutKey) {
        newState_layoutKey.layoutKey = action.payload;
      }
      return newState_layoutKey;

    case constant.RESIZE_SIGNAL_TRANS:
      let newState_resizeSignal = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize) {
        newState_resizeSignal.isUserStartResize = action.payload;
      }
      return newState_resizeSignal;

    case constant.IS_NODE_LABEL_SHOWN_TRANS:
      let newState_isNodeLabelShown = Object.assign({}, prevState);
      if (action.payload !== prevState.isNodeLabelShown) {
        newState_isNodeLabelShown.isNodeLabelShown = action.payload;
      }
      return newState_isNodeLabelShown;

    case constant.IS_LINK_LABEL_SHOWN_TRANS:
      let newState_isLinkLabelShown = Object.assign({}, prevState);
      if (action.payload !== prevState.isLinkLabelShown) {
        newState_isLinkLabelShown.isLinkLabelShown = action.payload;
      }
      return newState_isLinkLabelShown;

    case constant.IS_LINK_FILTER_ON_TRANS:
      let newState_isUserStyleApplied = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStyleApplied) {
        newState_isUserStyleApplied.isUserStyleApplied = action.payload;
      }
      return newState_isUserStyleApplied;

    case constant.IS_LINK_WEIGHT_APPLIED_TRANS:
      let newState_isLinkWeightApplied = Object.assign({}, prevState);
      if (action.payload !== prevState.isLinkWeightApplied) {
        newState_isLinkWeightApplied.isLinkWeightApplied = action.payload;
      }
      return newState_isLinkWeightApplied;

    case constant.LINK_FACTOR_TRANS:
      let newState_linkFactor = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.linkFactor) {
        newState_linkFactor.linkFactor = action.payload;
      }
      return newState_linkFactor;

    case constant.SAVED_GRAPH_TRANS:
      let newState_sg = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.savedGraph) {
        newState_sg.savedGraph = action.payload;
      }
      return newState_sg;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.transgraphSettings;
      }
  }
};

export default transgraphSettingsReducer;
