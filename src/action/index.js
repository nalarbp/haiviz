import * as constant from "../utils/constants";

// ======================= COLOR SCALE   ====================
export function resetIsolateDataColor(value) {
  return {
    type: constant.RESET_COLOR_SCALE,
    payload: value
  };
}

export function changeIsolateDataToGray(value) {
  return {
    type: constant.NEW_GRAY_SIGNAL,
    payload: value
  };
}

export function changeIsColorScaleDownloading(value) {
  return {
    type: constant.COLOR_IS_DOWNLOADING,
    payload: value
  };
}

export function changeColorToIsolateData(value) {
  return {
    type: constant.NEW_COLOR_DATA,
    payload: value
  };
}

export function setColorScaleType(value) {
  return {
    type: constant.COLOR_TYPE,
    payload: value
  };
}
export function setColorScale(value) {
  return {
    type: constant.INIT_COLOR_SCALE_ALL,
    payload: value
  };
}
export function setColorBySpecies(value) {
  return {
    type: constant.COLOR_BY_SPECIES,
    payload: value
  };
}
export function setColorByLocation(value) {
  return {
    type: constant.COLOR_BY_LOCATION,
    payload: value
  };
}
export function setColorBySourceType(value) {
  return {
    type: constant.COLOR_BY_SOURCETYPE,
    payload: value
  };
}
export function setColorByProfile1(value) {
  return {
    type: constant.COLOR_BY_PROFILE_ONE,
    payload: value
  };
}
export function setColorByProfile2(value) {
  return {
    type: constant.COLOR_BY_PROFILE_TWO,
    payload: value
  };
}
export function setColorByProfile3(value) {
  return {
    type: constant.COLOR_BY_PROFILE_THREE,
    payload: value
  };
}

// ======================= COLOR  SETTINGS ====================
export function changeColorNodeSize(value) {
  return {
    type: constant.NEW_NODE_SIZE_COLOR,
    payload: value
  };
}
export function changeColorTextSize(value) {
  return {
    type: constant.NEW_TEXT_SIZE_COLOR,
    payload: value
  };
}
export function changeColorTextOffset(value) {
  return {
    type: constant.NEW_TEXT_OFFSET_COLOR,
    payload: value
  };
}
export function changeColorResizeSignal(value) {
  return {
    type: constant.NEW_RESIZE_SIGNAL_COLOR,
    payload: value
  };
}

// ======================== COLOR SETTINGS =======================
export function changeColorIndex(val) {
  //val: patient, user or site
  return {
    type: constant.NEW_COLOR_INDEX,
    colorIndex: val
  };
}

// ======================= SELECTED_DATA ========================
export function setSelectedData(value) {
  return {
    type: constant.SELECTED_DATA,
    payload: value
  };
}

// ===================  LOADING INPUT FILES  ==================
export function loadIsolateData(val) {
  return {
    type: constant.NEW_ISOLATE_DATA,
    payload: val
  };
}

export function loadTransmissionData(val) {
  return {
    type: constant.NEW_TRANSMISSION,
    payload: val
  };
}

export function loadSVG(val) {
  return {
    type: constant.NEW_SVG,
    payload: val
  };
}
export function loadMovementData(val) {
  return {
    type: constant.NEW_MOVEMENT_DATA,
    payload: val
  };
}

// ================== SIDE MENU RENDERING ======================
export function setActiveChart(val) {
  return {
    type: constant.ACTIVE_CHART,
    chartId: val
  };
}
export function deactivateChart(val) {
  return {
    type: constant.INACTIVE_CHART,
    chartId: val
  };
}
export function setActiveChartMulti(val) {
  //val is the whole activeChart object
  return {
    type: constant.MULTI_ACTIVE_CHART,
    payload: val
  };
}
export function deactivateChartMulti(val) {
  return {
    type: constant.MULTI_INACTIVE_CHART,
    payload: val
  };
}
export function setLayout(layout) {
  return {
    type: constant.NEW_LAYOUT,
    newLayout: layout
  };
}
