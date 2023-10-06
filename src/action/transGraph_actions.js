import * as constant from "../utils/constants";

// ======================= TRANSGRAPH SETTINGS ====================
export function changeTransIsDownloading(value) {
  return {
    type: constant.IS_DOWNLOADING_TRANS,
    payload: value,
  };
}

export function changeTransNodeSize(value) {
  return {
    type: constant.NODE_SIZE_TRANS,
    payload: value,
  };
}
export function changeTransTextSize(value) {
  return {
    type: constant.TEXT_SIZE_TRANS,
    payload: value,
  };
}
export function changeTransTextOffset(value) {
  return {
    type: constant.TEXT_OFFSET_TRANS,
    payload: value,
  };
}
export function changeTransResizeSignal(value) {
  return {
    type: constant.RESIZE_SIGNAL_TRANS,
    payload: value,
  };
}

export function changeTransLayoutKey(value) {
  return {
    type: constant.KEY_TRANS,
    payload: value,
  };
}

export function changeTransIsLinkLabelShown(value) {
  return {
    type: constant.IS_LINK_LABEL_SHOWN_TRANS,
    payload: value,
  };
}

export function changeTransIsNodeLabelShown(value) {
  return {
    type: constant.IS_NODE_LABEL_SHOWN_TRANS,
    payload: value,
  };
}

export function changeTransisUserStyleApplied(value) {
  return {
    type: constant.IS_LINK_FILTER_ON_TRANS,
    payload: value,
  };
}

export function changeTransLinkLabelSize(value) {
  return {
    type: constant.LINK_LABEL_SIZE_TRANS,
    payload: value,
  };
}

export function changeTransisLinkWeightApplied(value) {
  return {
    type: constant.IS_LINK_WEIGHT_APPLIED_TRANS,
    payload: value,
  };
}
export function changeTransLinkFactor(value) {
  return {
    type: constant.LINK_FACTOR_TRANS,
    payload: value,
  };
}
