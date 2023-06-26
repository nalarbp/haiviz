import { combineReducers } from "redux";
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
//
export const initialState = {
  isolateData: null,
  floorplan: null,
  simulatedMap: null,
  tree: null,
  transmission: null,
  movementData: null,
  selectedData: null, //we will generate date extent from only isolate data, when brush:generate isoaltes rather than sending daterange
  layout: {
    sm: [
      { i: "summary", x: 0, y: 0, w: 12, h: 10, minW: 12, minH: 10 },
      { i: "idxCol", x: 6, y: 0, w: 12, h: 10, minW: 12, minH: 10 },
      { i: "simulatedMap", x: 0, y: 11, w: 12, h: 15, minW: 12, minH: 10 },
      { i: "floorplan", x: 6, y: 11, w: 12, h: 15, minW: 12, minH: 10 },
      { i: "tree", x: 6, y: 26, w: 12, h: 15, minW: 12, minH: 10 },
      { i: "transmission", x: 0, y: 26, w: 12, h: 15, minW: 12, minH: 10 },
      { i: "bar", x: 0, y: 42, w: 12, h: 10, isResizable: false },
      { i: "gantt", x: 0, y: 50, w: 12, h: 10, minW: 12, minH: 10 },
      { i: "table", x: 0, y: 60, w: 12, h: 17, isResizable: false },
      { i: "home", x: 0, y: 0, w: 12, minH: 10, static: true },
      { i: "treeGantt", x: 0, y: 0, w: 12, h: 15, minW: 12, minH: 10 },
    ],
    md: [
      { i: "summary", x: 0, y: 0, w: 6, h: 10, minW: 2, minH: 5 },
      { i: "idxCol", x: 8, y: 0, w: 6, h: 10, minW: 1, minH: 10 },
      { i: "simulatedMap", x: 0, y: 11, w: 6, h: 15, minW: 2, minH: 10 },
      { i: "floorplan", x: 6, y: 11, w: 6, h: 15, minW: 2, minH: 10 },
      { i: "tree", x: 6, y: 26, w: 6, h: 15, minW: 2, minH: 10 },
      { i: "transmission", x: 0, y: 11, w: 6, h: 15, minW: 2, minH: 10 },
      { i: "bar", x: 0, y: 42, w: 12, h: 10, isResizable: false },
      { i: "gantt", x: 0, y: 50, w: 12, h: 10, minW: 4, minH: 10 },
      { i: "table", x: 0, y: 60, w: 12, h: 18, isResizable: false },
      { i: "home", x: 0, y: 0, w: 12, minH: 10, static: true },
      { i: "treeGantt", x: 0, y: 0, w: 12, h: 15, minW: 12, minH: 10 },
    ],
  },
  activeChart: {
    summary: { show: false },
    idxCol: { show: false },
    simulatedMap: { show: false },
    floorplan: { show: false },
    bar: { show: false },
    tree: { show: false },
    transmission: { show: false },
    gantt: { show: false },
    treeGantt: { show: false },
    table: { show: false },
  },
  phylotreeSettings: {
    isUserStartResize: false,
    layout: "rectangular",
    isTaxaAligned: true,
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
    layoutKey: "cose",
    isLinkLabelShown: false,
    linkLabelSize: 5,
    isUserStyleApplied: false,
    transgraphIsDownloading: false,
    isLinkWeightApplied: false,
    linkFactor: 1,
    nodeSize: 5,
    textSize: 5,
    textOffset: 0,
  },
  colorScale: {
    colorType: "location",
    byLocation: null,
    bySpecies: null,
    bySourceType: null,
    byProfile1: null,
    byProfile2: null,
    byProfile3: null,
  },
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
    scaleMode: "daily",
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

const rootReducer = combineReducers(
  {
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
