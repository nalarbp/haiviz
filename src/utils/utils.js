import { csv, text, xml } from "d3-fetch";
import { hierarchy } from "d3-hierarchy";
import dotparser from "dotparser";
import { scaleOrdinal, scaleSequential } from "d3-scale";
import * as d3Chroma from "d3-scale-chromatic";
import { rollup } from "d3-array";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { color } from "d3-color";
//import SVGSaver from "svgsaver";

const moment = extendMoment(Moment);
const _ = require("lodash");
const xmlJSconvert = require("xml-js");

const d3 = {
  ...require("d3-scale"),
  ...require("d3-selection"),
  ...require("d3-time-format"),
  ...require("d3-time"),
  ...require("d3-array"),
};

// ============================ TABLE DATA UTIL  =============================
export function getIsolateDataHeader(key) {
  switch (key) {
    case "isolate_name":
      return "Name";
    case "isolate_species":
      return "Species";
    case "isolate_sourceName":
      return "Source name";
    case "isolate_sourceType":
      return "Source type";
    case "isolate_colLocation":
      return "Collection location";
    case "isolate_colDate":
      return "Collection date";
    case "profile_1":
      return "Profile 1";
    case "profile_2":
      return "Profile 2";
    case "profile_3":
      return "Profile 3";
    default:
      return null;
  }
}

export function getColorTypeTitle(key) {
  switch (key) {
    case "species":
      return "Species";
    case "sourceType":
      return "Source type";
    case "location":
      return "Location";
    case "profile1":
      return "Profile 1";
    case "profile2":
      return "Profile 2";
    case "profile3":
      return "Profile 3";
    default:
      return null;
  }
}

export function colorOrdinalInterpolator(domainList, d3ChromaInterpolator) {
  //domainList: [locA, locB, locC]
  //d3ChromaInterpolator: d3.InterpolateSpectral
  //return a function (interpolator) from a given domain and d3 interpolator
  var domainInterpolator = scaleSequential()
    .domain([0, domainList.length])
    .interpolator(d3ChromaInterpolator);
  var colorList = [];
  for (var i = 0; i < domainList.length; i++) {
    colorList.push(domainInterpolator(i));
  }
  var colorScale = scaleOrdinal()
    .domain(domainList)
    .range(colorList);
  return colorScale;
}

export function generateColor(domainList) {
  //in: list;[patA, patB, ...]
  //out: obj; {patA:#colIdx, patB:#colIdx, ...}
  var res = {},
    interpolator = colorOrdinalInterpolator(domainList);

  domainList.forEach(function(d) {
    res[d] = interpolator(d);
  });

  return res;
}
// ============================ TIME-RELATED UTIL  =============================
// TODO: Change later to moment approach for consistancy
export const formatTime = d3.timeFormat("%d %b %Y");
export const timeFormatting = d3.timeFormat("%d/%B/%Y");
export const isoDateParser = d3.utcParse("%Y-%m-%d");
export const dateToString_ddmmYYYY = d3.timeFormat("%d %b %Y");
export const dateToStringIS08601 = d3.timeFormat("%Y-%m-%d");
export const formatWeekOfYear = d3.timeFormat("%Y-%V");
export const formatWeekISO8601 = d3.timeFormat("%V");

// =========================== INPUT-RELATED UTIL ==============================
export const childrenAccessorFn = ([, value]) => {
  return value.size && Array.from(value);
};

export async function getIsolateData(
  fileURL,
  loadIsolateData,
  setColorScale,
  loadSimulatedMap,
  setisLoading
) {
  let data_promise_raw = await csv(fileURL).then(function(result) {
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
  let header_is_valid = true;
  validHeaders.forEach((item) => {
    if (inputHeaders.indexOf(item) === -1) {
      header_is_valid = false;
    }
  });

  if (!header_is_valid) {
    alert("Invalid headers");
    setisLoading(false);
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
    setisLoading(false);
    return;
  }

  // no empty record in isolate_name
  const isolate_name_empty = isolate_name[""] ? true : false;

  if (isolate_name_empty) {
    alert("Invalid data: column isolate_name contain empty record");
    setisLoading(false);
    return;
  }

  //console.log(data_promise_raw);

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
    setisLoading(false);
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

  let species_list = data_promise
    .map((d) => d.isolate_species)
    .filter(filterUnique);
  let location_list = data_promise
    .map((d) => d.isolate_colLocation)
    .filter(filterUnique);
  let sourceType_list = data_promise
    .map((d) => d.isolate_sourceType)
    .filter(filterUnique);
  let profile1_list = data_promise.map((d) => d.profile_1).filter(filterUnique);
  let profile2_list = data_promise.map((d) => d.profile_2).filter(filterUnique);
  let profile3_list = data_promise.map((d) => d.profile_3).filter(filterUnique);

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
        profile3_list,
        "profile_3",
        "profile_3:color"
      )
    : colorOrdinalInterpolator(profile3_list, d3Chroma.interpolateViridis);

  let colorbySpecies_Map = new Map();
  species_list.forEach((d) => {
    colorbySpecies_Map.set(d, color(colorScale_bySpecies(d)).formatHex());
  });
  let colorbyLocation_Map = new Map();
  location_list.forEach((d) => {
    colorbyLocation_Map.set(d, color(colorScale_byLocation(d)).formatHex());
  });
  let colorbySourceType_Map = new Map();
  sourceType_list.forEach((d) => {
    colorbySourceType_Map.set(d, color(colorScale_bySourceType(d)).formatHex());
  });
  let colorbyProfile1_Map = new Map();
  profile1_list.forEach((d) => {
    colorbyProfile1_Map.set(d, color(colorScale_byProfile1(d)).formatHex());
  });
  let colorbyProfile2_Map = new Map();
  profile2_list.forEach((d) => {
    colorbyProfile2_Map.set(d, color(colorScale_byProfile2(d)).formatHex());
  });
  let colorbyProfile3_Map = new Map();
  profile3_list.forEach((d) => {
    colorbyProfile3_Map.set(d, color(colorScale_byProfile3(d)).formatHex());
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
  // make simulated map ================================================#########
  const locationRollup = rollup(
    data_promise,
    (d) => d.length,
    (d) => d.isolate_colLocation
  );
  const hierarchyData = hierarchy([null, locationRollup], childrenAccessorFn)
    .sum(([, value]) => value)
    .sort((a, b) => b.value - a.value);
  //console.log(hierarchyData);
  //=========================================================================
  //When all pass validation test, send to store
  //Convert isolateDate into Map
  let isolateData_Map = new Map();
  data_promise.forEach((d) => {
    isolateData_Map.set(d.uid, d);
  });

  //console.log(colorScale_byLocation.domain());
  loadIsolateData(isolateData_Map);
  loadSimulatedMap(hierarchyData);
  setColorScale(colorScale_init);
}

export async function parseXML(fileURL, dispatchDataToStore) {
  let data_promise = await xml(fileURL).then(function(result) {
    return result;
  });
  dispatchDataToStore(data_promise);
}
export async function parseTree(fileURL, dispatchDataToStore) {
  let data_promise = await text(fileURL).then(function(result) {
    return result;
  });
  //const phylotree = newickParse(data_promise);
  // const treeLayout = hierarchy(phylotree, d => d.branchset).sum(d =>
  //   d.branchset ? 0 : 1
  // );
  const treeLayout = data_promise;
  dispatchDataToStore(treeLayout);
}
export async function parseGraph(fileURL, dispatchDataToStore) {
  //TODO: Make sure graph has name attribute
  let graph_promise = await text(fileURL).then(function(result) {
    return result;
  });
  //const graph = parseDOTtoJSON(graph_promise);
  const graph = parseDOTtoCytoscape(graph_promise);
  if (graph) {
    //add layout detection here
    //console.log(graph);
    dispatchDataToStore(graph);
  }
}
//
export async function parseMovement(fileURL, dispatchDataToStore) {
  let data_promise = await csv(fileURL).then(function(result) {
    return result;
  });
  const validHeaders = [
    "source_name",
    "location_name",
    "start_date",
    "end_date",
  ];
  const inputHeaders = Object.keys(data_promise[0]);
  let header_is_valid = true;
  validHeaders.forEach((item) => {
    if (inputHeaders.indexOf(item) === -1) {
      header_is_valid = false;
    }
  });
  if (!header_is_valid) {
    alert("Invalid headers");
    return;
  }
  // no empty record or invalid format on start and end date
  let date_invalid = false;
  data_promise.forEach(function(d) {
    if (moment(d.start_date) && moment(d.end_date)) {
      d.start_date = moment(d.start_date);
      d.end_date = moment(d.end_date);
    } else {
      date_invalid = true;
    }
  });
  if (date_invalid) {
    alert("Invalid data: wrong date format in column start or end date");
    return;
  }
  data_promise.sort((a, b) => a.source_name - b.source_name);
  dispatchDataToStore(data_promise);
}

export const getMapLocationData = (mapDataNode) => {
  if (mapDataNode) {
    const serializedMapData = new XMLSerializer().serializeToString(
      mapDataNode
    );
    const locationDataObj = xmlJSconvert.xml2js(serializedMapData, {
      compact: true,
      spaces: 0,
    });
    const locationData = locationDataObj.mapdata.location.map((d) => {
      return {
        name: d._attributes.name,
        x: +d._attributes.x,
        y: +d._attributes.y,
      };
    });
    const locationData_Map = new Map();
    locationData.forEach((d) => {
      locationData_Map.set(d.name, d);
    });
    return locationData_Map;
  } else {
    return null;
  }
};
// ================================= OTHERS  ===================================
export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

export function getColorScale(colorScaleState) {
  switch (colorScaleState.colorType) {
    case "species":
      return colorScaleState.bySpecies;
    case "location":
      return colorScaleState.byLocation;
    case "sourceType":
      return colorScaleState.bySourceType;
    case "profile1":
      return colorScaleState.byProfile1;
    case "profile2":
      return colorScaleState.byProfile2;
    case "profile3":
      return colorScaleState.byProfile3;

    default:
      return colorScaleState.byLocation;
  }
}

export function getColumnNameByColorType(d, colorType) {
  switch (colorType) {
    case "species":
      return d.isolate_species;
    case "location":
      return d.isolate_colLocation;
    case "sourceType":
      return d.isolate_sourceType;
    case "profile1":
      return d.profile_1;
    case "profile2":
      return d.profile_2;
    case "profile3":
      return d.profile_3;

    default:
      return d.isolate_colLocation;
  }
}

export function getColorScaleByObject(obj, colorScaleState) {
  if (obj) {
    switch (colorScaleState.colorType) {
      case "species":
        return colorScaleState.bySpecies.get(obj.isolate_species);
      case "location":
        return colorScaleState.byLocation.get(obj.isolate_colLocation);
      case "sourceType":
        return colorScaleState.bySourceType.get(obj.isolate_sourceType);
      case "profile1":
        return colorScaleState.byProfile1.get(obj.profile_1);
      case "profile2":
        return colorScaleState.byProfile2.get(obj.profile_2);
      case "profile3":
        return colorScaleState.byProfile3.get(obj.profile_3);

      default:
        return colorScaleState.byLocation.get(obj.isolate_colLocation);
    }
  } else {
    return "black";
  }
}

export function getColorScaleByObjectAndColType(obj, colorScaleState, colType) {
  if (obj) {
    switch (colType) {
      case "species":
        return colorScaleState.bySpecies.get(obj.isolate_species);
      case "location":
        return colorScaleState.byLocation.get(obj.isolate_colLocation);
      case "sourceType":
        return colorScaleState.bySourceType.get(obj.isolate_sourceType);
      case "profile1":
        return colorScaleState.byProfile1.get(obj.profile_1);
      case "profile2":
        return colorScaleState.byProfile2.get(obj.profile_2);
      case "profile3":
        return colorScaleState.byProfile3.get(obj.profile_3);

      default:
        return colorScaleState.byLocation.get(obj.isolate_colLocation);
    }
  } else {
    return "black";
  }
}

export function getIsolateCompositionByCategory(category, isolateData_Map) {
  let isolateData = _.cloneDeep(Array.from(isolateData_Map.values()));
  let data;
  switch (category) {
    case "species":
      let species_count = _.countBy(isolateData, (d) => {
        return d.isolate_species;
      });
      data = Object.keys(species_count).map((key) => ({
        _id: key,
        id: key,
        label: key,
        value: species_count[key],
      }));
      return { categoryLength: Object.keys(species_count).length, data: data };
    case "sourceType":
      let source_count = _.countBy(isolateData, (d) => {
        return d.isolate_sourceType;
      });
      data = Object.keys(source_count).map((key) => ({
        _id: key,
        id: key,
        label: key,
        value: source_count[key],
      }));
      return { categoryLength: Object.keys(source_count).length, data: data };
    case "location":
      let location_count = _.countBy(isolateData, (d) => {
        return d.isolate_colLocation;
      });
      data = Object.keys(location_count).map((key) => ({
        _id: key,
        id: key,
        label: key,
        value: location_count[key],
      }));
      return { categoryLength: Object.keys(location_count).length, data: data };

    case "profile1":
      let profile1_count = _.countBy(isolateData, (d) => {
        return d.profile_1;
      });
      data = Object.keys(profile1_count).map((key) => ({
        _id: key,
        id: key,
        label: key,
        value: profile1_count[key],
      }));
      return { categoryLength: Object.keys(profile1_count).length, data: data };

    case "profile2":
      let profile2_count = _.countBy(isolateData, (d) => {
        return d.profile_2;
      });
      data = Object.keys(profile2_count).map((key) => ({
        _id: key,
        id: key,
        label: key,
        value: profile2_count[key],
      }));
      return { categoryLength: Object.keys(profile2_count).length, data: data };

    case "profile3":
      let profile3_count = _.countBy(isolateData, (d) => {
        return d.profile_3;
      });
      data = Object.keys(profile3_count).map((key) => ({
        _id: key,
        id: key,
        label: key,
        value: profile3_count[key],
      }));
      return { categoryLength: Object.keys(profile3_count).length, data: data };

    default:
      return data;
  }
}

export function downloadFileAsText(filename, text) {
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function filterUnique(value, index, self) {
  // filter to only unique value from a given array
  return self.indexOf(value) === index;
}

export function getDatafromChildren(childrenList) {
  var res = [];
  for (var i = 0; i < childrenList.length; i++) {
    if (childrenList[i].meta) {
      res.push(childrenList[i].meta);
    }
  }
  //sort result by date
  return res;
}

// phyloTree auxilarry function ============================================
export function tree_rightAngleDiagonal() {
  var projection = function(d) {
    return [d.y, d.x];
  };
  var path = function(pathData) {
    return "M" + pathData[0] + " " + pathData[1] + " " + pathData[2];
  };

  function diagonal(diagonalPath) {
    var source = diagonalPath.source,
      target = diagonalPath.target,
      pathData = [source, { x: target.x, y: source.y }, target];
    pathData = pathData.map(projection);
    return path(pathData);
  }
  return diagonal;
}

export function tree_scaleBranchLengths(nodes, w) {
  // Visit all nodes and adjust y pos width distance metric
  var visitPreOrder = function(root, callback) {
    callback(root);
    if (root.children) {
      for (var i = root.children.length - 1; i >= 0; i--) {
        visitPreOrder(root.children[i], callback);
      }
    }
  };
  visitPreOrder(nodes[0], function(node) {
    node.rootDist =
      (node.parent ? node.parent.rootDist : 0) + (node.data.length || 0);
  });

  var rootDists = nodes.map(function(n) {
    return n.rootDist;
  });
  var yscale = d3
    .scaleLinear()
    .domain([0, d3.max(rootDists)])
    .range([0, w]);

  visitPreOrder(nodes[0], function(node) {
    node.y = yscale(node.rootDist);
  });

  return yscale;
}

export function tree_pathGenerator(d) {
  function tree_path(pathData) {
    return "M" + pathData[0] + " " + pathData[1] + " " + pathData[2];
  }
  var source = d.source;
  var target = d.target;
  var pathData = [source, { x: target.x, y: source.y }, target];
  pathData = pathData.map(function(el) {
    return [el.y, el.x];
  });
  return tree_path(pathData);
}

export function sortNumber(a, b) {
  return a - b;
}

export function parseDOTtoJSON(dot) {
  function _getNodeLabelAtt(attrList) {
    let nameAttObj = attrList.find((att) => att.id === "name");
    let nameAtt = nameAttObj && nameAttObj.eq ? String(nameAttObj.eq) : null;
    return nameAtt;
  }

  function _getLinkWeightAtt(attrList) {
    let weightAttObj = attrList.find((att) => att.id === "weight");
    let weightAtt =
      weightAttObj && weightAttObj.eq && weightAttObj.eq !== "null"
        ? parseFloat(weightAttObj.eq)
        : null;

    return weightAtt;
  }

  function _getLinkColorAtt(attrList) {
    let colorAttObj = attrList.find((att) => att.id === "color");
    let colorAtt =
      colorAttObj && color(colorAttObj.eq)
        ? color(colorAttObj.eq).formatHex()
        : color("black").formatHex();
    return colorAtt;
  }

  function _getLinkStyleAtt(attrList) {
    let styleAttObj = attrList.find((att) => att.id === "style");
    let validStyle = ["solid", "dashed"];
    let styleAtt =
      styleAttObj && validStyle.indexOf(styleAttObj.eq) !== -1
        ? styleAttObj.eq
        : "solid";
    return styleAtt;
  }

  function _getLinkDirAtt(attrList) {
    let dirAttObj = attrList.find((att) => att.id === "dir");
    let validDir = ["forward", "none"];
    let dirAtt =
      dirAttObj && validDir.indexOf(dirAttObj.eq) !== -1
        ? dirAttObj.eq
        : "forward";
    return dirAtt;
  }

  function _createTransmissionDatafromDOT(graphDOT) {
    var data = { nodes: [], links: [] };
    graphDOT[0].children.forEach(function(d) {
      if (d.type === "node_stmt") {
        //process nodes
        // node (d)={'id':d}
        var id = d.node_id.id,
          name = _getNodeLabelAtt(d.attr_list);
        data.nodes.push({ id: id, name: name });
      } else {
        //process edges
        //link (d)={'source': 'P1', 'target': 'P2', 'weight': '0.5'}
        var source = d.edge_list[0].id,
          target = d.edge_list[1].id,
          weight = _getLinkWeightAtt(d.attr_list),
          color = _getLinkColorAtt(d.attr_list),
          dir = _getLinkDirAtt(d.attr_list),
          style = _getLinkStyleAtt(d.attr_list);

        data.links.push({
          source: source,
          target: target,
          weight: weight,
          color: color,
          dir: dir,
          style: style,
        });
      }
    });
    return data;
  }
  try {
    dotparser(dot);
  } catch (e) {
    alert(("Invalid dot format. Error": e));
    return;
  }
  const graphdata = dotparser(dot);
  //console.log(graphdata);
  const jsondata = _createTransmissionDatafromDOT(graphdata);

  return jsondata;
}

export function isTreeHasLength(treeNodes) {
  var lengths = treeNodes.map((d) => d.data.length).filter(filterUnique);
  return lengths && lengths.length === 1 ? false : true;
}

export function adjustNodesPosition(nodes) {
  var newPosition,
    currentNodeDepth = 0;

  nodes.forEach(function(d) {
    if (d.depth - currentNodeDepth === 1) {
      currentNodeDepth = d.depth;
      //totalTreeLength;
    }
  });

  return newPosition;
}

export function treeBranchHasParrent(node) {
  if (!node.parent) {
    return 0;
  } else {
    return node.data.length + treeBranchHasParrent(node.parent);
  }
}

export function randomize(uniqArr) {
  //in locations list, for each make random index x and y
  //x: randomly move 5px to left or right (max 10px)
  //y: randomly move 5px to top or bottom (max 10px)
  //out res = {di:{x:3, y:4}, dj:{x:3, y:4}}
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  var res = {};
  uniqArr.forEach(function(d) {
    res[d] = {
      x: getRandomArbitrary(0.45, 0.55),
      y: getRandomArbitrary(0.45, 0.55),
    };
  });
  return res;
}

export async function getIsolateDataForDev(
  fileURL,
  loadIsolateData,
  setColorScale,
  loadSimulatedMap
) {
  let data_promise_raw = await csv(fileURL).then(function(result) {
    return result;
  });

  const inputHeaders = Object.keys(data_promise_raw[0]);

  // no empty record or invalid format in collection date
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
  // make simulated map ================================================#########
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

  //=========================================================================
  //When all pass validation test, send to store
  //Convert isolateDate into Map
  let isolateData_Map = new Map();
  data_promise.forEach((d) => {
    isolateData_Map.set(d.uid, d);
  });

  //console.log(colorScale_byLocation.domain());
  loadIsolateData(isolateData_Map);
  loadSimulatedMap(hierarchyData);
  setColorScale(colorScale_init);
}

export const brushResizePath = function(d, temporalbar_h) {
  let e = +(d.type === "e"),
    x = e ? 1 : -1,
    y = temporalbar_h / 6;
  return (
    "M" +
    0.5 * x +
    "," +
    y +
    "A6,6 0 0 " +
    e +
    " " +
    6.5 * x +
    "," +
    (y + 6) +
    "V" +
    (2 * y - 6) +
    "A6,6 0 0 " +
    e +
    " " +
    0.5 * x +
    "," +
    2 * y +
    "Z" +
    "M" +
    2.5 * x +
    "," +
    (y + 8) +
    "V" +
    (2 * y - 8) +
    "M" +
    4.5 * x +
    "," +
    (y + 8) +
    "V" +
    (2 * y - 8)
  );
};

export function computeQuadraticCurve(p1x, p1y, p2x, p2y, offset) {
  // mid-point of line:
  let mpx = (p2x + p1x) * 0.5;
  let mpy = (p2y + p1y) * 0.5;

  // angle of perpendicular to line:
  let theta = Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2;

  // offset: distance of control point from mid-point of line:

  // location of control point:
  let c1x = mpx + offset * Math.cos(theta);
  let c1y = mpy + offset * Math.sin(theta);

  return [c1x, c1y];
}

export function getUserDefinedColor(
  metadataTable,
  domainList,
  headerName,
  headerNameColor
) {
  let colorList = [];
  domainList.forEach((d) => {
    let rec = metadataTable.find((e) => e[headerName] === d);
    //console.log(rec[headerNameColor]);
    let userCol =
      rec && color(rec[headerNameColor])
        ? color(rec[headerNameColor])
        : color("Black");
    colorList.push(userCol);
  });

  let colorScale = scaleOrdinal()
    .domain(domainList)
    .range(colorList);
  return colorScale;
}

export function removeAllChildFromNode(elem) {
  var e = document.querySelector(elem);
  var first = e.firstElementChild;
  while (first) {
    first.remove();
    first = e.firstElementChild;
  }
}
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function downloadSVG(id) {
  //const svgsaver = new SVGSaver();
  let svg_node = document.querySelector(`#${id}`);
  let XMLS = new XMLSerializer();
  if (id === "summary-piechart") {
    svg_node = document.querySelector(`#${id} svg`);
  }
  let svgString = XMLS.serializeToString(svg_node);
  downloadFileAsText(`HAIviz-${id}.svg`, svgString);

  // const svg_node = document.querySelector("#" + id);

  // let XMLS = new XMLSerializer();
  // let svgString = XMLS.serializeToString(svg_node);
  // downloadFileAsText(`HAIviz-${id}.svg`, svgString);
  //svgsaver.asSvg(svg_node, `HAIviz-${id}.svg`);
}

export function parseDOTtoCytoscape(dot) {
  function _getNodeLabelAtt(attrList) {
    let nameAttObj = attrList.find((att) => att.id === "name");
    let nameAtt = nameAttObj && nameAttObj.eq ? String(nameAttObj.eq) : null;
    return nameAtt;
  }

  function _getLinkWeightAtt(attrList) {
    let weightAttObj = attrList.find((att) => att.id === "weight");
    let weightAtt =
      weightAttObj && weightAttObj.eq && weightAttObj.eq !== "null"
        ? parseFloat(weightAttObj.eq).toFixed(2)
        : null;

    return weightAtt;
  }

  function _getLinkColorAtt(attrList) {
    let colorAttObj = attrList.find((att) => att.id === "color");
    let colorAtt =
      colorAttObj && color(colorAttObj.eq)
        ? color(colorAttObj.eq).formatHex()
        : color("black").formatHex();
    return colorAtt;
  }

  function _getLinkStyleAtt(attrList) {
    let styleAttObj = attrList.find((att) => att.id === "style");
    let validStyle = ["solid", "dashed"];
    let styleAtt =
      styleAttObj && validStyle.indexOf(styleAttObj.eq) !== -1
        ? styleAttObj.eq
        : "solid";
    return styleAtt;
  }

  function _getLinkDirAtt(attrList) {
    let dirAttObj = attrList.find((att) => att.id === "dir");
    let validDir = ["forward", "none"];
    let dirAtt =
      dirAttObj && validDir.indexOf(dirAttObj.eq) !== -1
        ? dirAttObj.eq
        : "forward";
    return dirAtt;
  }

  function _createTransmissionDatafromDOT(graphDOT) {
    //get directed or undirected
    let graphType = graphDOT[0].type;
    //var data = { nodes: [], links: [] };
    let data_cy = [];
    let node_labels = [];
    graphDOT[0].children.forEach(function(d) {
      if (d.type === "node_stmt") {
        let id = d.node_id.id;
        let nodeName = _getNodeLabelAtt(d.attr_list);
        let name = nodeName ? nodeName : id;
        node_labels.push(name);
        data_cy.push({ data: { id: id, label: name } });
      } else {
        //process edges
        //link (d)={'source': 'P1', 'target': 'P2', 'weight': '0.5'}
        let source = d.edge_list[0].id;
        let target = d.edge_list[1].id;
        let weight = _getLinkWeightAtt(d.attr_list);
        let color = _getLinkColorAtt(d.attr_list);
        let dir = graphType === "graph" ? "none" : _getLinkDirAtt(d.attr_list);
        let style = _getLinkStyleAtt(d.attr_list);
        data_cy.push({
          data: {
            source: source,
            target: target,
            weight: weight,
            color: color,
            dir: dir,
            style: style,
          },
        });
      }
    });
    let graphObj = { nodeLabels: node_labels, data: data_cy };
    return graphObj;
  }
  try {
    dotparser(dot);
    const graphdata = dotparser(dot);
    const jsondata = _createTransmissionDatafromDOT(graphdata);

    return jsondata;
  } catch (e) {
    alert(("Invalid dot format. Error": e));
    return;
  }
}

export function isIsolateOrHost(nodeLabels, isolateNames, sourceNames) {
  let res = null;
  let intersectIsolatesAndLabels = isolateNames.filter((x) =>
    nodeLabels.includes(x)
  );
  let intersectHostsAndLabels = sourceNames.filter((x) =>
    nodeLabels.includes(x)
  );
  if ((intersectIsolatesAndLabels.length / isolateNames.length) * 100 >= 5) {
    res = "isolate";
  } else {
    if ((intersectHostsAndLabels.length / sourceNames.length) * 100 >= 5) {
      res = "host";
    } else {
      res = null;
    }
  }
  return res;
}
/* SAVE IT FOR LATER
================================================================================

*/
