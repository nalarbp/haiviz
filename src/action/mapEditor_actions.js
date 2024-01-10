import * as constant from "../utils/constants";

// ======================= LOAD DATA ====================
export function loadSvgMapEditor(val) {
  return {
    type: constant.NEW_SVG_MAPEDITOR,
    payload: val,
  };
}

export function loadLocationsMapEditor(val) {
  return {
    type: constant.NEW_LOCDATA_MAPEDITOR,
    payload: val,
  };
}
