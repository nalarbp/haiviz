import * as constant from "../utils/constants";

// ======================= LOAD DATA ====================
export function loadSimulatedMap(val) {
  return {
    type: constant.NEW_SIMULATED_MAP,
    payload: val
  };
}

// ======================= CHANGE SETTINGS ====================
export function changeSimapResizeSignal(value) {
  return {
    type: constant.NEW_RESIZE_SIGNAL_SIMAP,
    payload: value
  };
}
export function changeSimapNodeSize(value) {
  return {
    type: constant.NEW_NODE_SIZE_SIMAP,
    payload: value
  };
}
export function changeSimapTextSize(value) {
  return {
    type: constant.NEW_TEXT_SIZE_SIMAP,
    payload: value
  };
}
export function changeSimapLayout(value) {
  return {
    type: constant.NEW_LAYOUT_SIMAP,
    payload: value
  };
}
export function changeSimapIsLocTextShown(value) {
  return {
    type: constant.NEW_IS_LOC_TEXT_SHOWN_SIMAP,
    payload: value
  };
}
