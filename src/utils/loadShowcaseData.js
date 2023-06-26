import { text, csv } from "d3-fetch";
import { hierarchy } from "d3-hierarchy";
import * as d3Chroma from "d3-scale-chromatic";
import * as constant from "./constants";
import { rollup } from "d3-array";
import {
  isoDateParser,
  filterUnique,
  colorOrdinalInterpolator,
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
  let data_promise_raw = await csv(fileURL.isolateData).then(function(result) {
    return result;
  });
  const validHeaders = [
    "isolate_name",
    "isolate_species",
    "isolate_colDate",
    "isolate_colLocation",
    "isolate_sourceType",
    "isolate_sourceName",
    "profile_1",
    "profile_2",
    "profile_3",
  ];
  const inputHeaders = Object.keys(data_promise_raw[0]);
  let isCompulsoryHeadersValid = true;
  validHeaders.forEach((item) => {
    if (inputHeaders.indexOf(item) === -1) {
      isCompulsoryHeadersValid = false;
    }
  });
  if (!isCompulsoryHeadersValid) {
    alert("Invalid file: missing compulsory header(s)");
    return;
  }
  // no duplicate in isolate name
  const isolate_name = _.countBy(data_promise_raw, "isolate_name");
  const duplicatedRecords = Object.keys(isolate_name)
    .map((key) => {
      return { name: key, count: isolate_name[key] };
    })
    .filter((d) => d.count > 1);
  if (duplicatedRecords.length > 0) {
    alert(
      "Invalid data: duplicate record in column isolate name:" +
        `${JSON.stringify(duplicatedRecords)}`
    );
    return;
  }
  // no empty record in isolate_name
  const isolate_name_empty = isolate_name[""] ? true : false;
  if (isolate_name_empty) {
    alert("Invalid data: column isolate_name contain empty record");
    return;
  }
  // no empty record or invalid format in collection date
  let isolate_date_invalid = false;
  data_promise_raw.forEach(function(d) {
    d.isolate_name = d.isolate_name.replace(/\s*$/, "");
    d.isolate_colDate = d.isolate_colDate.replace(/\s*$/, "");
    d.isolate_sourceType = d.isolate_sourceType.replace(/\s*$/, "");
    d.isolate_sourceName = d.isolate_sourceName.replace(/\s*$/, "");
    d.isolate_species = d.isolate_species.replace(/\s*$/, "");
    d.isolate_colLocation = d.isolate_colLocation.replace(/\s*$/, "");
    if (isoDateParser(d.isolate_colDate)) {
      d["uid"] = d.isolate_name;
      d.isolate_colDate = isoDateParser(d.isolate_colDate);
    } else {
      isolate_date_invalid = true;
    }
  });

  let data_promise = data_promise_raw.map((d) => {
    return {
      uid: d.uid,
      isolate_name: d.isolate_name,
      isolate_colDate: d.isolate_colDate,
      isolate_sourceType: d.isolate_sourceType,
      isolate_sourceName: d.isolate_sourceName,
      isolate_species: d.isolate_species,
      isolate_colLocation: d.isolate_colLocation,
      profile_1: d.profile_1,
      profile_2: d.profile_2,
      profile_3: d.profile_3,
    };
  });
  if (isolate_date_invalid) {
    alert("Invalid data: wrong date format in column collection date");
    return;
  }
  // Create initial color table =====================================
  // check and extract user defined color in the metadata
  let colHeaders = [];
  inputHeaders.forEach((header) => {
    if (header.split(":")[1] === "color") {
      let headerColorObj = {
        headerName: header,
        isHeaderHasColor: true,
      };
      colHeaders.push(headerColorObj);
    }
  });
  let colHeaders_Map = new Map();
  colHeaders.forEach((d) => {
    colHeaders_Map.set(d.headerName, d);
  });
  let isolateName_list = data_promise
    .map((d) => {
      return d.isolate_name;
    })
    .filter(filterUnique);
  let sourceName_list = data_promise
    .map((d) => {
      return d.isolate_sourceName;
    })
    .filter(filterUnique);
  let species_list = data_promise
    .map((d) => {
      return d.isolate_species;
    })
    .filter(filterUnique);
  let location_list = data_promise
    .map((d) => {
      return d.isolate_colLocation;
    })
    .filter(filterUnique);
  let sourceType_list = data_promise
    .map((d) => {
      return d.isolate_sourceType;
    })
    .filter(filterUnique);
  let profile1_list = data_promise
    .map((d) => {
      return d.profile_1;
    })
    .filter(filterUnique);
  let profile2_list = data_promise
    .map((d) => {
      return d.profile_2;
    })
    .filter(filterUnique);
  let profile3_list = data_promise
    .map((d) => {
      return d.profile_3;
    })
    .filter(filterUnique);

  // is predefined color for species true? if so extract the color (metadata, column name), if no generate initial color
  const colorScale_bySpecies = colHeaders_Map.get("isolate_species:color")
    ? getUserDefinedColor(
        data_promise_raw,
        species_list,
        "isolate_species",
        "isolate_species:color"
      )
    : colorOrdinalInterpolator(species_list, d3Chroma.interpolateRdYlBu);

  const colorScale_byLocation = colHeaders_Map.get("isolate_colLocation:color")
    ? getUserDefinedColor(
        data_promise_raw,
        location_list,
        "isolate_colLocation",
        "isolate_colLocation:color"
      )
    : colorOrdinalInterpolator(location_list, d3Chroma.interpolateSpectral);

  const colorScale_bySourceType = colHeaders_Map.get("isolate_sourceType:color")
    ? getUserDefinedColor(
        data_promise_raw,
        sourceType_list,
        "isolate_sourceType",
        "isolate_sourceType:color"
      )
    : colorOrdinalInterpolator(sourceType_list, d3Chroma.interpolateSpectral);

  const colorScale_byProfile1 = colHeaders_Map.get("profile_1:color")
    ? getUserDefinedColor(
        data_promise_raw,
        profile1_list,
        "profile_1",
        "profile_1:color"
      )
    : colorOrdinalInterpolator(profile1_list, d3Chroma.interpolateViridis);

  const colorScale_byProfile2 = colHeaders_Map.get("profile_2:color")
    ? getUserDefinedColor(
        data_promise_raw,
        profile2_list,
        "profile_2",
        "profile_2:color"
      )
    : colorOrdinalInterpolator(profile2_list, d3Chroma.interpolateViridis);

  const colorScale_byProfile3 = colHeaders_Map.get("profile_3:color")
    ? getUserDefinedColor(
        data_promise_raw,
        profile1_list,
        "profile_3",
        "profile_3:color"
      )
    : colorOrdinalInterpolator(profile3_list, d3Chroma.interpolateViridis);

  let colorbySpecies_Map = new Map();
  species_list.forEach((d) => {
    colorbySpecies_Map.set(d, colorScale_bySpecies(d));
  });
  let colorbyLocation_Map = new Map();
  location_list.forEach((d) => {
    colorbyLocation_Map.set(d, colorScale_byLocation(d));
  });
  let colorbySourceType_Map = new Map();
  sourceType_list.forEach((d) => {
    colorbySourceType_Map.set(d, colorScale_bySourceType(d));
  });
  let colorbyProfile1_Map = new Map();
  profile1_list.forEach((d) => {
    colorbyProfile1_Map.set(d, colorScale_byProfile1(d));
  });
  let colorbyProfile2_Map = new Map();
  profile2_list.forEach((d) => {
    colorbyProfile2_Map.set(d, colorScale_byProfile2(d));
  });
  let colorbyProfile3_Map = new Map();
  profile3_list.forEach((d) => {
    colorbyProfile3_Map.set(d, colorScale_byProfile3(d));
  });
  const colorScale_init = {
    colorType: "location",
    byLocation: colorbyLocation_Map,
    bySpecies: colorbySpecies_Map,
    bySourceType: colorbySourceType_Map,
    byProfile1: colorbyProfile1_Map,
    byProfile2: colorbyProfile2_Map,
    byProfile3: colorbyProfile3_Map,
    byLocation_ori: colorbyLocation_Map,
    bySpecies_ori: colorbySpecies_Map,
    bySourceType_ori: colorbySourceType_Map,
    byProfile1_ori: colorbyProfile1_Map,
    byProfile2_ori: colorbyProfile2_Map,
    byProfile3_ori: colorbyProfile3_Map,
  };
  // make simulated map ================================================########
  const locationRollup = rollup(
    data_promise,
    (d) => d.length,
    (d) => d.isolate_colLocation
  );
  const childrenAccessorFn = ([, value]) => {
    return value.size && Array.from(value);
  };
  const hierarchyData = hierarchy([null, locationRollup], childrenAccessorFn)
    .sum(([, value]) => value)
    .sort((a, b) => b.value - a.value);

  // make validation for transmission graph

  //=========================================================================
  let isolateData_Map = new Map();
  data_promise.forEach((d) => {
    isolateData_Map.set(d.uid, d);
  });

  loadIsolateData(isolateData_Map);
  loadSimulatedMap(hierarchyData);
  setColorScale(colorScale_init);

  //xml
  if (fileURL.xmlData) {
    parseXML(fileURL.xmlData, loadXML);
  } else {
    loadXML(null);
  }
  //tree
  if (fileURL.treeData) {
    parseTree(fileURL.treeData, loadTreeData);
  } else {
    loadTreeData(null);
  }
  //trans
  if (fileURL.transData) {
    async function parseGraph(fileURL) {
      let graph_promise = await text(fileURL).then(function(result) {
        return result;
      });
      //const graph = parseDOTtoJSON(graph_promise);
      const graph = parseDOTtoCytoscape(graph_promise);
      const nodeLabels = graph.nodeLabels;
      const graphData = graph.data;
      if (graphData) {
        //add layout detection here

        let graph_key = isIsolateOrHost(
          nodeLabels,
          isolateName_list,
          sourceName_list
        );
        let graphWithValidation = { graphKey: graph_key, graphData: graphData };
        loadTransgraphData(graphWithValidation);
      }
    }
    parseGraph(fileURL.transData);
  } else {
    loadTransgraphData(null);
  }
  //movement
  if (fileURL.movementData) {
    parseMovement(fileURL.movementData, loadMovementData);
  } else {
    loadMovementData(null);
  }
}
