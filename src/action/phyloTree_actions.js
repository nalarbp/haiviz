import * as constant from "../utils/constants";

// ======================= LOAD DATA ====================
export function loadTreeData(val) {
  return {
    type: constant.NEW_TREE,
    payload: val
  };
}

// ======================= PHYLOTREE SETTINGS ====================
//RESIZE SIGNAL
export function changeTreeResizeSignal(value) {
  return {
    type: constant.RESIZE_SIGNAL_TREE,
    payload: value
  };
}

//LAYOUT
export function changeTreeLayout(value) {
  return {
    type: constant.LAYOUT_TREE,
    payload: value
  };
}
//DOWNLOAD
export function changeIsTreeDownloading(value) {
  return {
    type: constant.IS_DOWNLOADING_TREE,
    payload: value
  };
}

//NODE
export function changeIsTreeNodeAligned(value) {
  return {
    type: constant.IS_NODE_ALIGNED,
    payload: value
  };
}
export function changeTreeNodeSize(value) {
  return {
    type: constant.NODE_SIZE_TREE,
    payload: value
  };
}
export function changeTreeTextSize(value) {
  return {
    type: constant.NODE_LABEL_SIZE_TREE,
    payload: value
  };
}
export function changeTreeTextOffset(value) {
  return {
    type: constant.NODE_LABEL_OFFSET_TREE,
    payload: value
  };
}

//SCALE
export function changeIsTreeScaleShown(value) {
  return {
    type: constant.IS_SCALE_SHOWN_TREE,
    payload: value
  };
}
export function changeTreeScaleFactor(value) {
  return {
    type: constant.SCALE_FACTOR_TREE,
    payload: value
  };
}
export function changeTreeCustomScale(value) {
  return {
    type: constant.SCALE_CUSTOM_VALUE_TREE,
    payload: value
  };
}
