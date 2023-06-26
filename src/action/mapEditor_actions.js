import * as constant from "../utils/constants";

// ======================= LOAD DATA ====================
export function loadSvgData(val) {
  return {
    type: constant.NEW_SVG_MAPEDITOR,
    payload: val
  };
}

export function loadLocationData(val) {
  return {
    type: constant.NEW_LOCDATA_MAPEDITOR,
    payload: val
  };
}
