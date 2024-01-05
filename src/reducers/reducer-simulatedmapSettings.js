import {
  NEW_RESIZE_SIGNAL_SIMAP,
  NEW_NODE_SIZE_SIMAP,
  NEW_TEXT_SIZE_SIMAP,
  NEW_OVERLAY_GRAPH_SIMAP,
  NEW_FORCE_SIMAP,
  NEW_LAYOUT_SIMAP,
  NEW_IS_LOC_TEXT_SHOWN_SIMAP
} from "../utils/constants";
import { initialState } from "../reducers";

const simulatedmapSettingsReducer = (prevState, action) => {
  switch (action.type) {
    case NEW_RESIZE_SIGNAL_SIMAP:
      let newState_resizeSignal_simap = Object.assign({}, prevState);
      if (action.payload !== prevState.isUserStartResize_simap) {
        newState_resizeSignal_simap.isUserStartResize_simap = action.payload;
      }
      return newState_resizeSignal_simap;
      
    case NEW_NODE_SIZE_SIMAP:
      let newState_nodeSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.nodeSize) {
        newState_nodeSize.nodeSize = action.payload;
      }
      return newState_nodeSize; // if no change return same state with before

    case NEW_TEXT_SIZE_SIMAP:
      let newState_textSize = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.textSize) {
        newState_textSize.textSize = action.payload;
      }
      return newState_textSize;

    case NEW_OVERLAY_GRAPH_SIMAP:
      let newState_overlayGraph = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.overlayGraph) {
        newState_overlayGraph.overlayGraph = action.payload;
      }
      return newState_overlayGraph;

    case NEW_FORCE_SIMAP:
      let newState_forceSettings = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.force) {
        newState_forceSettings.force = action.payload;
      }
      return newState_forceSettings;

    case NEW_LAYOUT_SIMAP:
      let newState_layout = Object.assign({}, prevState);
      if (action.payload && action.payload !== prevState.layout) {
        newState_layout.layout = action.payload;
      }
      return newState_layout;

    case NEW_IS_LOC_TEXT_SHOWN_SIMAP:
      let newState_isLocationLabelShown = Object.assign({}, prevState);
      if (action.payload !== prevState.isLocationLabelShown) {
        newState_isLocationLabelShown.isLocationLabelShown = action.payload;
      }
      return newState_isLocationLabelShown;

    default:
      if (prevState) {
        return prevState;
      } else {
        return initialState.simulatedmapSettings;
      }
  }
};

export default simulatedmapSettingsReducer;
