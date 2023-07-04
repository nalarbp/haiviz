import { csv, text, xml } from "d3-fetch";
import newickParse from "../utils/newick";
import { hierarchy, cluster } from "d3-hierarchy";
import dotparser from "dotparser";
import { scaleOrdinal } from "d3-scale";
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
      return "ID";
    case "isolate_colLocation":
      return "Location";
    case "isolate_colDate":
      return "Date";
    default:
      return key;
  }
}

// ============================ TIME-RELATED UTIL  =============================
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

export async function readPreloadedDatasetJSON(preloadedDataset_json_url, preloadedDatasetJSONToStore) {
  let response = await fetch(preloadedDataset_json_url);
  let dataInBlob = await response.blob();
  const reader = new FileReader();
  reader.readAsText(dataInBlob);
  reader.onloadend = function (evt) {
    const dataJSON = JSON.parse(evt.target.result);
    const preloadedDatasets = new Map();
    dataJSON.data_list.forEach((p) => {
      preloadedDatasets.set(p.id, p);
    });
    preloadedDatasetJSONToStore(preloadedDatasets);
  };
}

export function colorLUTFromUser(headerWithColor, data_promise_raw) {
  let data_raw = _.cloneDeep(data_promise_raw);
  let colorMap = new Map();
  //iterate each row and set the map by sample_id and color
  data_raw.forEach((r) => {
    let col =
      r[headerWithColor] && color(r[headerWithColor])
        ? color(r[headerWithColor]).formatHex()
        : color("lightgray").formatHex();
    colorMap.set(r.sample_id, col);
    colorMap.set(r.sample_id, 
      {colorValue:col, 
       colorAttribute: r[headerWithColor]});

  });
  return colorMap;
}

export function createColorLUT(raw_sampleJSON, colorIndex) {
  //input list of sample object [{sample:MS2, vanType: vanA}, ... ], colorIndex e.g vanType
  //output a Map of sample return color for single given colorIndex (Column)
  let sampleJSON = _.cloneDeep(raw_sampleJSON);
  let colorLUT = null;
  if (Array.isArray(sampleJSON) && sampleJSON.length > 0) {
    let groupsAll = [];
    sampleJSON.forEach((d) => {
      groupsAll.push(d[colorIndex]);
    });
    
    let groups = groupsAll.filter(filterUnique); // array of unique element as the group (levels)
    //d3Chroma.schemeSet3 only has 12 color, if you have 13 dateset, the 13th will be same as the 1st
   
    let colorInterpolatorOrd = scaleOrdinal(d3Chroma.schemeSet3).domain(groups);
    let colorMap = new Map();
    sampleJSON.forEach((d) => {
      colorMap.set(d.sample, 
        {colorValue:colorInterpolatorOrd(d[colorIndex]), 
         colorAttribute: d[colorIndex]});
    });
    colorLUT = colorMap;
  }
  return colorLUT;
}

export async function getIsolateData(
  fileURL,
  metadataToSTORE,
  colorLUTtoSTORE,
  treemapToSTORE,
  setisLoading
) {
  let data_promise_raw = await csv(fileURL).then(function(result) {
    return result;
  });
  //check if input data contain all the required headers
  const validHeaders = [
    "id",
    "date",
    "location",
  ];
  const inputHeaders = Object.keys(data_promise_raw[0]);
  for (let i = 0; i < validHeaders.length; i++) {
    if (!inputHeaders.includes(validHeaders[i])) {
      alert(
        "Invalid data: input data must contain all the following headers: id, date, location"
      );
      setisLoading(false);
      return;
    }
  }

  //check if no empty record in id and duplicated record in id
  let isolate_id_invalid = false;
  let isolate_id_duplicated = false;
  let isolate_id_list = [];
  data_promise_raw.forEach(function(d) {
    d.id = d.id.replace(/\s*$/, "");
    if (d.id === "") {
      isolate_id_invalid = true;
    }
    if (isolate_id_list.includes(d.id)) {
      isolate_id_duplicated = true;
    }
    isolate_id_list.push(d.id);
  });
  if (isolate_id_invalid) {
    alert("Invalid data: empty record in column id");
    setisLoading(false);
    return;
  }
  if (isolate_id_duplicated) {
    alert("Invalid data: duplicated record in column id");
    setisLoading(false);
    return;
  }
  
  //check if no empty record in date and invalid format in date
  let isolate_date_invalid = false;
  data_promise_raw.forEach(function(d) {
    d.date = d.date.replace(/\s*$/, "");
    if (isoDateParser(d.date)) {
      d.date = isoDateParser(d.date);
    } else {
      isolate_date_invalid = true;
    }
  });
  if (isolate_date_invalid) {
    alert("Invalid data: invalid record or format in column date");
    setisLoading(false);
    return;
  }

  //convert any empty record in column location to "N/A"
  data_promise_raw.forEach(function(d) {
    d.location = d.location.replace(/\s*$/, "");
    if (d.location === "") {
      d.location = "N/A";
    }
  });

  //comply with previous version
  //transform headers: id to isolate_name, date to isolate_colDate, location to isolate_colLocation
  data_promise_raw.forEach(function(d) {
    d.isolate_name = d.id;
    d.isolate_colDate = d.date;
    d.isolate_colLocation = d.location;
    delete d.id;
    delete d.date;
    delete d.location;
  });

  //create a Map of metadata
  let metadata_map = new Map();
  data_promise_raw.forEach(function(d) {
    metadata_map.set(d.isolate_name, d);
  });

  //save metadata to store
  metadataToSTORE(metadata_map);

  //create simulated map (treemap) based on location using rollup
  const locationRollup = rollup(
    data_promise_raw,
    (d) => d.length,
    (d) => d.isolate_colLocation
  );
  const hierarchyData = hierarchy([null, locationRollup], childrenAccessorFn)
    .sum(([, value]) => value)
    .sort((a, b) => b.value - a.value);
  
  //save simulated map to store
  treemapToSTORE(hierarchyData);

  //create color scale
  let extra_columns = [];
  let columns_have_color = [];
  let colorLUTstore = {};
  
  //identify which columns color and regular
  inputHeaders.forEach((h) => {
    let splittedHeader = h.split(":");
    let isHeaderForColor =
      splittedHeader.length > 1 && splittedHeader[1] === "color" ? true : false;
    if (isHeaderForColor) {
      columns_have_color.push(splittedHeader[0]);
    } else {
      if (h !== "id" && h !== "date") {
        extra_columns.push(h);
      }
    }
  });

  //replace 'location' in extra_columns with 'isolate_colLocation'
  extra_columns = extra_columns.map((d) => {
    if (d === "location") {
      return "isolate_colLocation";
    } else {
      return d;
    }
  });

  //create color scale for each column that has no color
  extra_columns.forEach((d) => {
    const columnHeader = d;
    let cells = [];
    data_promise_raw.forEach((da) => {
      let cell = {}; //{sample: taxaA, header1: valueOfHeader1}
      cell["sample"] = da.isolate_name;
      cell[columnHeader] = da[columnHeader];
      cells.push(cell);
    });

    let colorLUT = null;
    let isHeaderHasColor = columns_have_color.indexOf(d) > -1 ? true : false;

    if (isHeaderHasColor) {
      let headerWithColor = d.concat(":color");
      colorLUT = colorLUTFromUser(headerWithColor, data_promise_raw);
    } else {
      colorLUT = createColorLUT(cells, columnHeader);
    }
    colorLUTstore[columnHeader] = colorLUT;
  });
  //save color scale to store
  let colorMap_init = {colorType: 'isolate_colLocation', colorMap: colorLUTstore}
  colorLUTtoSTORE(colorMap_init);
}

export async function parseXML(fileURL, dispatchDataToStore) {
  let data_promise = await xml(fileURL).then(function(result) {
    return result;
  });
  dispatchDataToStore(data_promise);
}


//functions
export async function parseTree(fileURL, loadTreeData, setisLoading) {
  let tree_promise = await text(fileURL).then(function(result) {
    return result;
  });
  // Do validation here
  let tree_is_valid = false;
  let phylotree;
  try {
    phylotree = newickParse(tree_promise); //err stop here
  } catch (e) {
    setisLoading(false);
  }
  //alert and stop when invalid, send tree to store when valid
  if (phylotree) {
    let phylotreeData = hierarchy(phylotree, (d) => d.branchset).sum((d) =>
      d.branchset ? 0 : 1
    );
    let clusterLayout = cluster().size([100, 100]);
    let treeLayout = clusterLayout(phylotreeData);
    let tree_leaves = treeLayout.leaves().map((d) => d.data.name);
    let tree_leaves_unique = tree_leaves.filter(filterUnique);
    if (tree_leaves.length === tree_leaves_unique.length) {
      tree_is_valid = true;
    } else {
      alert("Invalid tree: duplicated taxa names");
      setisLoading(false);
      return;
    }
  }
  if (tree_is_valid) {
    loadTreeData(tree_promise);
  } else {
    setisLoading(false);
    return;
  }
}

export async function parseGraph(fileURL, dispatchDataToStore, setisLoading) {
  let graph_promise = await text(fileURL).then(function(result) {
    return result;
  });
  const graph = parseDOTtoCytoscape(graph_promise);
  if (graph) {
    dispatchDataToStore(graph);
  } else {
    setisLoading(false);
    return;
  }
}

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
  let col = 'black'
  try {
    let colorIndex = colorScaleState.colorType
    col = colorScaleState.colorMap[colorIndex].get(obj.isolate_name).colorValue;
  } catch (error) {
  }
  return col
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
  let category_count = _.countBy(isolateData, (d) => {
    return d[category];
  });
  let data = null;
  data = Object.keys(category_count).map((key) => ({
    _id: key,
    id: key,
    label: key,
    value: category_count[key],
  }));
  return { categoryLength: Object.keys(category_count).length, data: data };
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
    alert(("Invalid dot format. Error", e));
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

