import * as constant from "../utils/constants";

// ======================= MOVEMENT SETTINGS ====================
export function changeMovementNodeSize(value) {
  return {
    type: constant.NEW_NODE_SIZE_MOVE,
    payload: value,
  };
}
export function changeMovementTextSize(value) {
  return {
    type: constant.NEW_TEXT_SIZE_MOVE,
    payload: value,
  };
}
export function changeMovementTextOffset(value) {
  return {
    type: constant.NEW_TEXT_OFFSET_MOVE,
    payload: value,
  };
}
export function changeMovementResizeSignal(value) {
  return {
    type: constant.NEW_RESIZE_SIGNAL_MOVE,
    payload: value,
  };
}
export function changeIsOverlappingLineShown(value) {
  return {
    type: constant.IS_OVERLAPPING_LINE_SHOWN,
    payload: value,
  };
}
export function changeIsOverlappingLineScaled(value) {
  return {
    type: constant.IS_OVERLAPPING_LINE_SCALED,
    payload: value,
  };
}
export function changeIsSortedBySuffix(value) {
  return {
    type: constant.IS_SORTED_BY_SUFFIX,
    payload: value,
  };
}
export function changeIsResort(value) {
  return {
    type: constant.IS_RESORT,
    payload: value,
  };
}
export function changeOverlappingLineScaleFactor(value) {
  return {
    type: constant.OVERLAPPING_LINE_SCALE_FACTOR,
    payload: value,
  };
}
export function changeSuffixSeparator(value) {
  return {
    type: constant.SUFFIX_SEPARATOR,
    payload: value,
  };
}
