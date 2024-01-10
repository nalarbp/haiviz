import { combineReducers } from "redux";
import { RESET_STORE } from "../utils/constants";
import movementDataReducer from "./reducer-movementDataReducer";
import activeChartReducer from "./reducer-activeChart";
import floorplanReducer from "./reducer-floorplanReducer";
import simulatedMapReducer from "./reducer-simulatedMap";
import transmissionReducer from "./reducer-transmissionReducer";
import treeReducer from "./reducer-treeReducer";
import isolateDataReducer from "./reducer-isolateDataReducer";
import layoutReducer from "./reducer-layoutReducer";
import colorScaleReducer from "./reducer-colorScale";
import selectedDataReducer from "./reducer-selectedData";
import phylotreeSettingsReducer from "./reducer-phylotreeSettings";
import phylotreeGanttSettingsReducer from "./reducer-phylotreeGanttSettings";
import simulatedmapSettingsReducer from "./reducer-simulatedmapSettings";
import transgraphSettingsReducer from "./reducer-transgraphSettings";
import colorscaleSettingsReducer from "./reducer-colorscaleSettings";
import localmapSettingsReducer from "./reducer-localmapSettings";
import movementSettingsReducer from "./reducer-movementSettings";
import temporalbarSettingsReducer from "./reducer-temporalbarSettings";
import mapEditorReducer from "./reducer-mapEditor";
import navSettingsReducer from "./reducer-navSettings";
import preloadedDataReducer from "./reducer-preloadedData";
import selectedPreloadedDataReducer from "./reducer-selectedPreloadedData";
import { DASHBOARD_LAYOUT } from "../utils/constants";

export const initialState = {
  preloadedData: null,
  selectedPreloadedData: null,
  isolateData: null,
  floorplan: null,
  simulatedMap: null,
  tree: null,
  transmission: null,
  movementData: null,
  selectedData: null, //we will generate date extent from only isolate data, when brush:generate isoaltes rather than sending daterange
  layout: DASHBOARD_LAYOUT,
  activeChart: {
    summary: { show: false },
    idxCol: { show: false },
    simulatedMap: { show: false },
    floorplan: { show: false },
    bar: { show: false },
    tree: { show: false },
    transmission: { show: false },
    gantt: { show: false },
    //treeGantt: { show: false }, //for the next major release
    table: { show: false },
  },
  phylotreeSettings: {
    isUserStartResize: false,
    layout: "rectangular",
    isTaxaAligned: false,
    isDownloading: false,
    nodeSize: 5,
    textSize: 6,
    textOffset: 0,
    isScaleShown: false,
    scaleFactor: 1,
    customScale: null,
  },
  phylotreeGanttSettings: {
    isUserStartResize: false,
    tree_percentW: 50,
    gantt_percentW: 50,
    nodeSize: 5,
    textSize: 6,
    textOffset: 0,
  },
  simulatedmapSettings: {
    isUserStartResize_simap: false,
    nodeSize: 5,
    textSize: 7,
    isLocationLabelShown: true,
    layout: "scatter", //[scatter, piechart]
    overlayGraph: false,
    force: { gravityStrength: -0.1, collideStrength: 0.3, tickNumber: 50 },
  },
  transgraphSettings: {
    isUserStartResize: false,
    layoutKey: "fcose",
    isLinkLabelShown: false,
    isNodeLabelShown: true,
    linkLabelSize: 5,
    isUserStyleApplied: false,
    transgraphIsDownloading: false,
    isLinkWeightApplied: false,
    linkFactor: 1,
    nodeSize: 5,
    textSize: 5,
    textOffset: 0,
    savedGraph: null,
    isSavingGraph: false,
  },
  colorScale: { colorType: "isolate_colLocation", colorMap: null },
  colorscaleSettings: {
    isUserStartResize: false,
    nodeSize: 5,
    textSize: 10,
    textOffset: 0,
    isDownloading: false,
  },
  localmapSettings: {
    isUserStartResize: false,
    nodeSize: 5,
    textSize: 5,
    textOffset: 0,
    isLocTextShown: true,
    layout: "scatter", //[scatter, piechart]
    overlayGraph: false,
    force: { gravityStrength: -0.1, collideStrength: 0.3, tickNumber: 50 },
  },
  movementSettings: {
    isUserStartResize: false,
    nodeSize: 5,
    textSize: 5,
    textOffset: 0,
    isOverlappingLineShown: false,
    isOverlappingLineScaled: false,
    overlappingLineScaleFactor: 0.1,
    layout: "gantt",
    isSortedBySuffix: false,
    suffixSeparator: "_",
    isResort: false,
  },
  temporalbarSettings: {
    isUserStartResize: false,
    chartMode: "stackedBar",
    scaleMode: "weekly",
    isAnimationPlaying: false,
  },
  mapEditor: {
    svgData: null,
    locationData: null,
  },
  navSettings: {
    navLocation: null,
  },
};

const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = initialState; // Reset the state to the initial state
  }
  return appReducer(state, action);
};

const appReducer = combineReducers(
  {
    preloadedData: preloadedDataReducer,
    selectedPreloadedData: selectedPreloadedDataReducer,
    activeChart: activeChartReducer,
    isolateData: isolateDataReducer,
    tree: treeReducer,
    selectedData: selectedDataReducer,
    transmission: transmissionReducer,
    floorplan: floorplanReducer,
    simulatedMap: simulatedMapReducer,
    movementData: movementDataReducer,
    layout: layoutReducer,
    colorScale: colorScaleReducer,
    phylotreeSettings: phylotreeSettingsReducer,
    phylotreeGanttSettings: phylotreeGanttSettingsReducer,
    simulatedmapSettings: simulatedmapSettingsReducer,
    transgraphSettings: transgraphSettingsReducer,
    colorscaleSettings: colorscaleSettingsReducer,
    localmapSettings: localmapSettingsReducer,
    movementSettings: movementSettingsReducer,
    temporalbarSettings: temporalbarSettingsReducer,
    mapEditor: mapEditorReducer,
    navSettings: navSettingsReducer,
  },
  initialState
);

export default rootReducer;
