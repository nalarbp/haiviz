import { fetchDataset } from "../utils/utils";

//tabualte first
////
// constants
import {
  INACTIVE_CHART,
  ACTIVE_CHART,
  NEW_DATASET,
  NEW_DATE_RANGE,
  NEW_FILTERED_SAMPLE_ID,
  NEW_FILTERED_ENTRY_ID,
  CLICKED_ELEMENT,
  NEW_METADATA,
  NEW_FLOORPLAN,
  NEW_TREE,
  NEW_LAYOUT,
  NEW_TRANSMISSION,
  ADD_FLOORPLAN,
  TRANS_LINK_THRESHOLD,
  NEW_TREE_ZOOM_LEVEL,
  NEW_COLOR_INDEX,
  NEW_SESSION,
  SELECTED_DATA,
  NEW_ISOLATE_DATA,
  NEW_DF,
  NEW_SVG,
  NEW_MOVEMENT_DATA
} from "../utils/constants";

export function load_DF(val) {
  //val: patient, user or site
  return {
    type: "NEW_DF",
    payload: val
  };
}

export function loadIsolateData(val) {
  return {
    type: NEW_ISOLATE_DATA,
    payload: val
  };
}

export function loadTransmissionData(val) {
  return {
    type: NEW_TRANSMISSION,
    payload: val
  };
}

export function loadTreeData(val) {
  return {
    type: NEW_TREE,
    payload: val
  };
}

export function loadSVG(val) {
  return {
    type: NEW_SVG,
    payload: val
  };
}

export function loadMovementData(val) {
  return {
    type: NEW_MOVEMENT_DATA,
    payload: val
  };
}

export function changeColorIndex(val) {
  //val: patient, user or site
  return {
    type: "NEW_COLOR_INDEX",
    colorIndex: val
  };
}

export function updateLoginState(loginState) {
  //fetch showcase dataset and send it to store
  return {
    type: "LOGIN_STATE",
    payload: loginState
  };
}

export function newDataset(metaURL, floorplanURL, treeURL, transURL) {
  //fetch showcase dataset and send it to store
  const dataset = fetchDataset(metaURL, floorplanURL, treeURL, transURL); //fetchdataset is different with getDataset

  return {
    type: NEW_DATASET,
    payload: dataset
  };
}

export function loadSession(states) {
  var allStates = states;
  return {
    type: NEW_SESSION,
    payload: allStates
  };
}
//load the clean data from the InputFile component/button
export function loadData(data, dataID) {
  var dataType;
  switch (dataID) {
    case "metadata":
      dataType = NEW_METADATA;
      break;
    case "floorplan":
      //setup active chart
      dataType = NEW_FLOORPLAN;
      break;
    case "tree":
      dataType = NEW_TREE;
      break;
    case "transmission":
      dataType = NEW_TRANSMISSION;
      break;
    default:
  }
  return {
    type: dataType,
    payload: data
  };
}
//
export function selectBrush(selectedExtent) {
  //console.log('>>ACT-selectBrush');
  return {
    type: NEW_DATE_RANGE,
    dateRange: selectedExtent
  };
}

export function setActiveChart(val) {
  //console.log('>>ACT-setActiveChart');
  return {
    type: ACTIVE_CHART,
    chartId: val
  };
}

export function deactivateChart(val) {
  //console.log('>>ACT-deactivateChart');
  return {
    type: INACTIVE_CHART,
    chartId: val
  };
}

export function setActiveChartMulti(activeChart) {
  //console.log('>>ACT-setActiveChart');
  return {
    type: ACTIVE_CHART,
    activeChart: activeChart
  };
}

export function setLayout(layout) {
  return {
    type: NEW_LAYOUT,
    newLayout: layout
  };
}

export function updateFilteredSampleID(filteredSampleID) {
  return {
    type: NEW_FILTERED_SAMPLE_ID,
    filteredSampleID: filteredSampleID
  };
}
export function updateFilteredEntryID(filteredEntryID) {
  //console.log('>>ACT-updateFilteredEntryID');
  return {
    type: NEW_FILTERED_ENTRY_ID,
    filteredEntryID: filteredEntryID
  };
}

export function updateClickedElement(entryID) {
  //console.log('>>ACT-updateClickedEl');
  return {
    type: CLICKED_ELEMENT,
    clickedElement: entryID
  };
}

export function updateTreeZoomLevel(newTreeZoomLevel) {
  return {
    type: NEW_TREE_ZOOM_LEVEL,
    treeZoomLevel: newTreeZoomLevel
  };
}

export function setTransLinkThreshold(value) {
  //console.log('>>ACT-deactivateChart');
  return {
    type: TRANS_LINK_THRESHOLD,
    thresholdValue: value
  };
}
export function selectActiveData(value) {
  return {
    type: SELECTED_DATA,
    selectedData: value
  };
}
//
// export function updateTransmissionData(value) {
//   //value: {nodes:[], links:[]}
//   return {
//     type: NEW_TRANSMISSION,
//     payload: value
//   };
// }
