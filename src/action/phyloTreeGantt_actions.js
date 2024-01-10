import * as constant from "../utils/constants";

// ======================= LOAD DATA ====================
export function loadTreeGanttData(val) {
  return {
    type: constant.NEW_TREEGANTT,
    payload: val
  };
}

// ======================= PHYLOTREEGANTT SETTINGS ====================
//RESIZE SIGNAL
export function changeTreeGanttResizeSignal(value) {
  return {
    type: constant.RESIZE_SIGNAL_TREEGANTT,
    payload: value
  };
}

//NODE
export function changeTreeGanttNodeSize(value) {
  return {
    type: constant.NODE_SIZE_TREEGANTT,
    payload: value
  };
}
export function changeTreeGanttTextSize(value) {
  return {
    type: constant.NODE_LABEL_SIZE_TREEGANTT,
    payload: value
  };
}
export function changeTreeGanttTextOffset(value) {
  return {
    type: constant.NODE_LABEL_OFFSET_TREEGANTT,
    payload: value
  };
}
