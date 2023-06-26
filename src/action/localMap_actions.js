import * as constant from "../utils/constants";

// ======================= LOCALMAP SETTINGS ====================
export function changeLocalmapNodeSize(value) {
  return {
    type: constant.NEW_NODE_SIZE_MAP,
    payload: value
  };
}
export function changeLocalmapTextSize(value) {
  return {
    type: constant.NEW_TEXT_SIZE_MAP,
    payload: value
  };
}
export function changeLocalmapTextOffset(value) {
  return {
    type: constant.NEW_TEXT_OFFSET_MAP,
    payload: value
  };
}
export function changeLocalmapResizeSignal(value) {
  return {
    type: constant.NEW_RESIZE_SIGNAL_MAP,
    payload: value
  };
}

export function changeLocalmapLayout(value) {
  return {
    type: constant.NEW_LAYOUT_MAP,
    payload: value
  };
}
export function changeLocalmapIsLocTextShown(value) {
  return {
    type: constant.NEW_IS_LOC_TEXT_SHOWN_MAP,
    payload: value
  };
}
