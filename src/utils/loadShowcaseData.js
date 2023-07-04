import { text, csv } from "d3-fetch";
import { hierarchy } from "d3-hierarchy";
import * as d3Chroma from "d3-scale-chromatic";
import * as constant from "./constants";
import { rollup } from "d3-array";
import {
  isoDateParser,
  filterUnique,
  parseXML,
  parseTree,
  //parseGraph,
  parseMovement,
  getUserDefinedColor,
  parseDOTtoCytoscape,
  isIsolateOrHost,
} from "./utils";
const _ = require("lodash");

// =========================== LOAD SHOWCASE DATA ============================
export function loadShowcaseData(
  datasetId,
  loadIsolateData,
  setColorScale,
  loadSimulatedMap,
  loadXML,
  loadTreeData,
  loadMovementData,
  loadTransgraphData,
  deactivateChartMulti
) {
  switch (datasetId) {
    case "showcase-data-1":
      loadShowcaseDataHandler(
        constant.SHOWCASE_1,
        loadIsolateData,
        setColorScale,
        loadSimulatedMap,
        loadXML,
        loadTreeData,
        loadMovementData,
        loadTransgraphData,
        deactivateChartMulti
      );
      break;
    case "showcase-data-2":
      loadShowcaseDataHandler(
        constant.SHOWCASE_2,
        loadIsolateData,
        setColorScale,
        loadSimulatedMap,
        loadXML,
        loadTreeData,
        loadMovementData,
        loadTransgraphData,
        deactivateChartMulti
      );
      break;
    case "showcase-data-3":
      loadShowcaseDataHandler(
        constant.SHOWCASE_3,
        loadIsolateData,
        setColorScale,
        loadSimulatedMap,
        loadXML,
        loadTreeData,
        loadMovementData,
        loadTransgraphData,
        deactivateChartMulti
      );
      break;
    default:
  }
}

export async function loadShowcaseDataHandler(
  fileURL,
  loadIsolateData,
  setColorScale,
  loadSimulatedMap,
  loadXML,
  loadTreeData,
  loadMovementData,
  loadTransgraphData,
  deactivateChartMulti
) {
  //deactivateChart
  let activeChart = {
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
  };
  deactivateChartMulti(activeChart);
}
