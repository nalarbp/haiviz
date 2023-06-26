import { interpolateRainbow } from "d3-scale-chromatic";
import { csv, json, text, xml } from "d3-fetch";
import newickParse from "./newick";
import icon_gantt from "../img/icon_gantt.png";
import icon_transmission from "../img/icon_trans.png";
import icon_floorplan from "../img/icon_floorplan.png";
import icon_tree from "../img/icon_tree.png";
import icon_simulatedMap from "../img/icon_simulatedMap.png";
import icon_table from "../img/icon_table.png";
import icon_bar from "../img/icon_bar.png";
import icon_ukulele from "../img/icon_brusher.png";
import icon_ukulele_inactive from "../img/icon_brusher_inactive.png";
import icon_gantt_inactive from "../img/icon_gantt_inactive.png";
import icon_transmission_inactive from "../img/icon_trans_inactive.png";
import icon_floorplan_inactive from "../img/icon_floorplan_inactive.png";
import icon_tree_inactive from "../img/icon_tree_inactive.png";
import icon_simulatedMap_inactive from "../img/icon_simulatedMap_inactive.png";
import icon_table_inactive from "../img/icon_table_inactive.png";
import icon_bar_inactive from "../img/icon_bar_inactive.png";
import icon_downloadVis_inactive from "../img/icon_downloadVis_inactive.png";
import icon_downloadVis_active from "../img/icon_downloadVis_active.png";
import icon_overlappingTable_inactive from "../img/icon_overlappingTable_inactive.png";
import icon_overlappingTable from "../img/icon_overlappingTable.png";

import dotparser from "dotparser";

const _ = require("lodash");

const d3 = {
  ...require("d3-scale"),
  ...require("d3-selection"),
  ...require("d3-time-format"),
  ...require("d3-time"),
  ...require("d3-color"),
  ...require("d3-array"),
};
//
export const formatTime = d3.timeFormat("%d %b %Y");
export const timeFormatting = d3.timeFormat("%d/%B/%Y");
export const isoDateParser = d3.utcParse("%Y-%m-%d");
export const dateToString_ddmmYYYY = d3.timeFormat("%d %b %Y");
export const dateToStringIS08601 = d3.timeFormat("%Y-%m-%d");
export const formatWeekOfYear = d3.timeFormat("%Y-%V");
export const formatWeekISO8601 = d3.timeFormat("%V");

// ===================== NEW ========================
export async function getIsolateData(fileURL, dispatchDataToStore) {
  var data_promise = await csv(fileURL).then(function(result) {
    return result.filter((d) => {
      return d.isolate_colDate !== "null";
    });
  });
  // cleaning data before updating store, filter out records with:
  //1. id: null
  //2. collection date: null

  data_promise.forEach(function(d) {
    d.isolate_colDate = isoDateParser(d.isolate_colDate);
  });
  //console.log(data_promise);
  dispatchDataToStore(data_promise);
}

export function getIsolateDataHeader(key) {
  switch (key) {
    case "id":
      return "ID";
    case "isolate_mlst":
      return "ST (MLST)";
    case "isolate_colDate":
      return "Collection date";
    case "isolate_name":
      return "Name";
    case "isolate_species":
      return "Species";
    case "isolate_sourceName":
      return "Source alias";
    case "isolate_colLocation":
      return "Collection location";
    default:
      return null;
  }
}

export async function getGraph(fileURL, dispatchDataToStore) {
  let data_promise = await text(fileURL).then(function(result) {
    return result;
  });
  const graph = parseDOTtoJSON(data_promise);
  dispatchDataToStore(graph);
}

export async function getTree(fileURL, dispatchDataToStore) {
  let data_promise = await text(fileURL).then(function(result) {
    return result;
  });
  const phylotree = newickParse(data_promise);
  dispatchDataToStore(phylotree);
}

export async function getSVG(fileURL, dispatchDataToStore) {
  var svg_promise = await xml(fileURL);
  dispatchDataToStore(svg_promise);
}

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

export function getIsolateCompositionByCategory(category, isolateData) {
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
    case "source":
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

    case "mlst":
      let mlst_count = _.countBy(isolateData, (d) => {
        return d.isolate_mlst;
      });
      data = Object.keys(mlst_count).map((key) => ({
        _id: key,
        id: key === "null" ? "null" : "ST" + key,
        label: key,
        value: mlst_count[key],
      }));
      return { categoryLength: Object.keys(mlst_count).length, data: data };
    default:
      return data;
  }
}
// ===================== NEW ========================

export function printIt() {
  console.log("PRINT !");
}
export function getIcon(key, metaIn, mapIn, treeIn, transIn) {
  switch (key) {
    case "gantt":
      if (!metaIn) {
        return icon_gantt_inactive;
      } else {
        return icon_gantt;
      }
      break;
    case "transmission":
      if (!transIn) {
        return icon_transmission_inactive;
      } else {
        return icon_transmission;
      }
      break;
    case "tree":
      if (!treeIn) {
        return icon_tree_inactive;
      } else {
        return icon_tree;
      }
      break;
    case "table":
      if (!metaIn) {
        return icon_table_inactive;
      } else {
        return icon_table;
      }
      break;
    case "bar":
      if (!metaIn) {
        return icon_bar_inactive;
      } else {
        return icon_bar;
      }
      break;
    case "simulatedMap":
      if (!metaIn) {
        return icon_simulatedMap_inactive;
      } else {
        return icon_simulatedMap;
      }
      break;
    case "overlappingTable":
      if (!metaIn) {
        return icon_overlappingTable_inactive;
      } else {
        return icon_overlappingTable;
      }
      break;
    case "ukulele":
      if (!metaIn) {
        return icon_ukulele_inactive;
      } else {
        return icon_ukulele;
      }
      break;
    case "floorplan":
      if (!mapIn) {
        return icon_floorplan_inactive;
      } else {
        return icon_floorplan;
      }
    case "downloadVis":
      if (mapIn || metaIn || treeIn || transIn) {
        return icon_downloadVis_active;
      } else {
        return icon_downloadVis_inactive;
      }

    default:
      return icon_floorplan;
  }
}

export function getButtonTitle(key) {
  switch (key) {
    case "gantt":
      return "Outbreak timeline";
    case "floorplan":
      return "Uploaded map";
    case "transmission":
      return "Transmission graph";
    case "tree":
      return "Phylogenetic tree";
    case "table":
      return "Metadata table";
    case "bar":
      return "Bar chart";
    case "simulatedMap":
      return "Simulated Map";
    case "overlappingTable":
      return "Overlapping Period";
    case "ukulele":
      return "Brusher";
    case "downloadVis":
      return "Download visualization";
    default:
      return "HAIviz";
  }
}

export function metadataDateValidation(inputDate, dateType) {
  const isoParser = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z"),
    withTimeParser = d3.utcParse("%Y-%m-%dT%H:%M:%S"),
    dateOnlyParser = d3.utcParse("%Y-%m-%d");

  var dateIso = isoParser(inputDate),
    dateWithTime = withTimeParser(inputDate),
    dateOnly = dateOnlyParser(inputDate),
    result;
  switch (dateType) {
    case "admission":
      if (inputDate !== "null" && dateIso) {
        result = dateIso;
      } else if (inputDate !== "null" && dateWithTime) {
        result = dateWithTime;
      } else if (inputDate !== "null" && dateOnly) {
        //convert; adding hour to 00:00:00
        var newDate = dateOnly;
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        result = newDate;
      } else {
        result = undefined;
      }
      break;
    case "discharge":
      if (inputDate !== "null" && dateIso) {
        result = dateIso;
      } else if (inputDate !== "null" && dateWithTime) {
        result = dateWithTime;
      } else if (inputDate !== "null" && dateOnly) {
        //convert; adding hour to 23:59:00
        var newDate = dateOnly;
        newDate.setHours(23);
        newDate.setMinutes(59);
        newDate.setSeconds(0);
        result = newDate;
      } else {
        return undefined;
      }
      break;
    case "collection":
      //when it samplingDate; set to 12:00
      if (inputDate !== "null" && dateIso) {
        result = dateIso;
      } else if (inputDate !== "null" && dateWithTime) {
        result = dateWithTime;
      } else if (inputDate !== "null" && dateOnly) {
        //convert; adding hour to 23:59:00
        var newDate = dateOnly;
        newDate.setHours(12);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        result = newDate;
      } else if (inputDate === "null") {
        result = null;
      } else {
        result = undefined;
      }
      break;
    default:
      result = undefined;
  }
  return result;
}

export function validateMetadata(metadata) {
  // if Compulsory headers is missing, alert, return false
  // if
  // if everything is extremely clean and valid, return data, means true.

  var validHeaders = [
    "entryID",
    "siteID",
    "siteLevel",
    "patID",
    "dateIn",
    "dateOut",
    "samplingDate",
    "sampleID",
    "colourLegend",
    "colour",
  ];
  var headers = Object.keys(metadata[0]);
  var entryIDs = [];
  var result = true;
  try {
    //check header, if not including valid headers throw error
    validHeaders.forEach(function(d) {
      if (headers.indexOf(d) === -1) {
        throw "Compulsory header is missing: " + d;
      }
    });

    metadata.forEach(function(d) {
      //entryID cannot be empty
      if (!d.entryID) {
        throw "Entry id cannot be empty!";
      }
      //entryID must be unique
      if (entryIDs.indexOf(d.entryID) === -1) {
        entryIDs.push(d.entryID);
      } else {
        throw "Entry id must be unique! Error at entryID: " + d.entryID;
      }
      //dates cannot be all null
      if (
        d.dateIn === "null" &&
        d.dateOut === "null" &&
        d.samplingDate === "null"
      ) {
        throw "Oops! date in, date out and sampling date cannot be all null together";
      }
      //dateIN format should be valid
      var transformedDateIn = metadataDateValidation(d.dateIn, "admission");
      if (!transformedDateIn) {
        throw "Admission date format is invalid " + d.dateIn;
      }
      //dateOut format should be valid
      var transformedDateOut = metadataDateValidation(d.dateOut, "discharge");
      if (!transformedDateOut) {
        throw "Discharge date format is invalid " + d.dateOut;
      }
      //collection date should be valid
      var transformedDateCol = metadataDateValidation(
        d.samplingDate,
        "collection"
      );
      if (transformedDateCol === undefined) {
        throw "Collection date format is invalid " + d.samplingDate;
      }

      //5. dateOut
    });

    //check minimum unempty headers
  } catch (err) {
    //any error throwed make result false;
    result = false;
    alert(err);
  } finally {
    return result;
  }
}

export function isDateValid(date) {
  if (date !== "null") {
    return true;
  } else {
    return false;
  }
}

export function cloneGeojson(obj) {
  function cloneArray(arr) {
    let cloneArr = [];
    for (var i in arr) {
      if (arr[i] != null && typeof arr[i] === Array)
        cloneArr[i] = cloneArray(arr[i]);
      else if (arr[i] != null && typeof arr[i] === Object) {
        cloneArr[i] = cloneGeojson(arr[i]);
      } else cloneArr[i] = arr[i];
    }
  }

  let clone = {};
  for (var i in obj) {
    if (obj[i] != null && typeof obj[i] === Object)
      clone[i] = cloneGeojson(obj[i]);
    else if (obj[i] != null && typeof obj[i] === Array) {
      clone[i] = cloneArray(obj[i]);
    } else clone[i] = obj[i];
  }
  return clone;
}

export function transformMetadata(metadata) {
  metadata.forEach(function(d) {
    // changing the nulls
    if (d.dateIn === "N/A" && d.samplingDate !== "N/A") {
      d.dateIn = new Date(d.samplingDate);
    }
    if (d.dateOut === "N/A") {
      //d.dateOut = d3.timeHour.offset(d.dateIn, 1)
      d.dateOut = new Date();
    }
    if (d.patID === "N/A" && d.sampleID !== "N/A") {
      d.patID = d.sampleID;
    }
    if (d.sampleID === "N/A" && d.patID !== "null") {
      d.sampleID = d.patID;
    }
  });
}

export function colorOrdinalInterpolator(domainList) {
  //return a function (interpolator) from a given domain
  var domainInterpolator = d3
    .scaleSequential()
    .domain([0, domainList.length])
    .interpolator(interpolateRainbow);
  var colorList = [];
  for (var i = 0; i < domainList.length; i++) {
    colorList.push(domainInterpolator(i));
  }
  var colorScale = d3
    .scaleOrdinal()
    .domain([domainList])
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

export function filterUnique(value, index, self) {
  // filter to only unique value from a given array
  return self.indexOf(value) === index;
}

export function filterUniqueNullUndefined(value, index, self) {
  // if value has an index, remove, as well as when they are null or undefined
  //return true to filter it out (remove it)
  if (self.indexOf(value) === index || !value) {
    return true;
  } else {
    return false;
  }
}

export function filter_str_null(el) {
  if (el === "null") {
    return false;
  } else {
    return true;
  }
}

export function filterUndefinedNull(el) {
  return !!el;
}

export function filterEntryID(metadata, dateRange) {
  var filteredEntryID = [];
  for (var i = 0; i < metadata.length; i++) {
    var d = metadata[i];
    if (d.dateIn > dateRange[1] || d.dateOut < dateRange[0]) {
      continue;
    } else {
      filteredEntryID.push(d.entryID);
    }
  }
  return filteredEntryID;
}

export function filterMetadataByDateRange(metadata, dateRange) {
  var filteredMetadata = metadata.filter(function(d) {
    if (d.dateIn < dateRange[1] && d.dateOut > dateRange[0]) {
      return d;
    }
  });
  return filteredMetadata;
}

export function filterSampleID(metadata, dateRange) {
  var filteredMetadata = [];
  for (var i = 0; i < metadata.length; i++) {
    var d = metadata[i];
    if (d.dateIn > dateRange[1] || d.dateOut < dateRange[0]) {
      continue;
    } else {
      filteredMetadata.push(d.sampleID);
    }
  }
  return filteredMetadata;
}

export function showTooltips(d, coordinates, tooltipsID) {
  // create hover data for tooltips hover display
  var tooltips = d3.select(tooltipsID);
  var html = "<strong>" + d.patID + "</strong>";

  tooltips.html(html);
  tooltips
    .style("display", "block")
    .style("position", "absolute")
    .style("background-color", "lightgreen")
    .style("top", coordinates[1] + 5 + "px")
    .style("left", coordinates[0] + 12 + "px")
    .style("padding", "5px 5px")
    .style("font-size", "12px")
    .style("border-radius", "5px");
}

export function getAdmissionDates(metadataObj) {
  // return an array of dateIn and dateOut from a given metadata object
  var dates = [];
  metadataObj.forEach((d) => {
    dates.push(d.dateIn);
    dates.push(d.dateOut);
  });
  return dates;
}

export function getSamplingDates(metadataObj) {
  // return an array of dateIn and dateOut from a given metadata object
  var dates = [];
  metadataObj.forEach((d) => {
    if (d.samplingDate !== "N/A") {
      dates.push(d.samplingDate);
    }
  });
  return dates;
}

export function getPatients(metadataObj) {
  // return an array of patID from a given metadata object
  var patients = [];
  metadataObj.forEach((d) => {
    patients.push(d.patID);
  });
  return patients;
}

export function getDatafromEntryID(metadata, entryID) {
  var res = [];
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].entryID === entryID) {
      res.push(metadata[i]);
      break;
    }
  }
  return res;
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

export function getSiteIDfromEntryID(entryID, metadata) {
  var siteID;
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].entryID === entryID) {
      siteID = metadata[i].siteID;
    }
  }
  return siteID;
}

export function getDetailsfromEntryID(entryID, metadata) {
  var details;
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].entryID === entryID) {
      details = Object.assign({}, metadata[i]);
      details.dateIn = formatTime(details.dateIn);
      details.dateOut = formatTime(details.dateOut);
    }
  }
  return details;
}

export function getPatIDfromSampleID(sample, metadata) {
  var patID;
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].sampleID === sample) {
      patID = metadata[i].patID;
    }
  }
  return patID;
}

export function getSiteIDfromSampleID(sample, metadata) {
  var siteID;
  for (var i = 0; i < metadata.length; i++) {
    //console.log(metadata[i].sampleID, sample)
    if (metadata[i].sampleID === sample) {
      siteID = metadata[i].siteID;
    }
  }
  return siteID;
}
export function getSamplingDatefromSampleID(sample, metadata) {
  var samplingDate;
  for (var i = 0; i < metadata.length; i++) {
    var smplDate = new Date(metadata[i].samplingDate);
    if (metadata[i].sampleID === sample) {
      samplingDate = smplDate;
    }
  }
  return samplingDate;
}

export function getXfromWeek(numDayinWeek, actualDate) {
  //console.log(actualDate.getMilliseconds());

  return actualDate;
}

export function countElemInArray(elem, arr) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === elem) {
      count += 1;
    }
  }
  return count;
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

export function getXfromPath(site, pathList, pathGenerator) {
  //return coordinates of x from a given path collection
  var x;
  for (var i = 0; i < pathList.length; i++) {
    if (pathList[i].properties.name && pathList[i].properties.name === site) {
      x = pathGenerator.centroid(pathList[i])[0];
      break;
    }
  }
  return x;
}

export function getYfromPath(site, pathList, pathGenerator) {
  //return coordinates of x from a given path collection
  var y;
  for (var i = 0; i < pathList.length; i++) {
    if (pathList[i].properties.name === site) {
      y = pathGenerator.centroid(pathList[i])[1];
      break;
    }
  }
  return y;
}

//TOOLTIP>>
export function showTooltip(tooltipID, data, locX, locY, option) {
  var loc = data.siteID;
  var source = data.patID;
  var iso = data.sampleID;
  var samplingDate =
    data.samplingDate !== "N/A" ? formatTime(data.samplingDate) : "N/A";
  var dateIn = formatTime(data.dateIn);
  var dateOut = formatTime(data.dateOut);
  var tooltip = d3
    .select(tooltipID)
    .style("opacity", 1)
    .style("left", locX + 10 + "px")
    .style("top", locY + 5 + "px")
    .append("div")
    .attr("class", "tooltipContent");

  switch (option) {
    case "gantt":
      tooltip.html(
        "<p>Source: " +
          source +
          "</p>" +
          "<p>Location: " +
          loc +
          "</p>" +
          "<p>Date In: " +
          dateIn +
          "</p>" +
          "<p>Date Out: " +
          dateOut +
          "</p>"
      );
      break;
    case "floorplan":
      tooltip.html(
        "<p>Isolate: " +
          iso +
          "</p>" +
          "<p>Source: " +
          source +
          "</p>" +
          "<p>Date In: " +
          dateIn +
          "</p>" +
          "<p>Date Out: " +
          dateOut +
          "</p>" +
          "<p>Sampling Date: " +
          samplingDate +
          "</p>"
      );
      break;
    case "tree":
      tooltip.html(
        "<p>Patient ID: " +
          source +
          "</p>" +
          "<p>Sampling Date: " +
          samplingDate +
          "</p>"
      );
      break;
    case "trans":
      tooltip.html(
        "<p>Patient ID: " +
          source +
          "</p>" +
          "<p>Sampling Date: " +
          samplingDate +
          "</p>"
      );
      break;
    case "gantt_sampling_circle":
      tooltip.html(
        "<p>Isolate: " +
          iso +
          "</p>" +
          "<p>Sampling Date: " +
          samplingDate +
          "</p>"
      );
      break;
    default:
  }
}

export function maxElFromArray(array) {
  //console.log(array);
  var res = { maxEl: 0, maxCount: 0 };
  if (array.length !== 0) {
    var modeMap = {};
    var maxEl = array[0];
    var maxCount = 0;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      //if el is not NA
      // do assignment
      //console.log(modeMap);
      if (el) {
        if (!modeMap[el]) {
          modeMap[el] = 1;
        } else {
          modeMap[el] += 1;
        }
        if (modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
    }
    return { maxEl: maxEl, maxCount: maxCount };
  } else {
    return res;
  }
}

export function weekRangeObj(arr) {
  //var uniqArr = arr.filter(filterUnique)
  var uniqArr = [];
  arr.forEach(function(d) {
    if (d) {
      uniqArr.push(d);
    }
  });
  arr.filter(filterUnique);

  var weekObj = [];
  for (var i = 0; i < uniqArr.length; i++) {
    var key = uniqArr[i];
    var count = 0;
    for (var k = 0; k < arr.length; k++) {
      if (arr[k] === key) {
        count += 1;
      }
    }
    weekObj.push({ el: key, count: count });
  }
  return weekObj;
}

export function getNumfromKey(key, arr) {
  var res;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].el === key) {
      res = arr[i].count;
    }
  }
  return res;
}

export function generateArrayFromRange(start, end) {
  var list = [];
  for (var i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
}

export function sortNumber(a, b) {
  return a - b;
}

export function hideTooltip(tooltipID) {
  d3.select(tooltipID).style("opacity", 0);
  d3.selectAll(".tooltipContent").remove();
}

export function createTransmissionData(transmissionCSV) {
  var data = { nodes: [], links: [] };
  //create node
  var nodes = [];
  transmissionCSV.forEach(function(d) {
    //d={'source': 'P1', 'target': 'P2', 'weight': '0.5'}
    nodes.push(d.source);
    nodes.push(d.target);
    data.links.push(d);
  });
  nodes = nodes.filter(filterUnique);
  nodes.forEach(function(d) {
    data.nodes.push({ id: d });
  });
  return data;
}

export function transmissionInputValidation(transmissionCSV) {
  var validHeaders = ["source", "target", "weight"];
  var headers = Object.keys(transmissionCSV[0]);
  var result = true;
  try {
    //check header
    //console.log(headers);
    headers.forEach(function(d) {
      if (validHeaders.indexOf(d) === -1) {
        throw "Invalid header: " + d;
      }
    });
    //check if it has empty record
    //check minimum unempty headers
  } catch (err) {
    result = false;
    alert(err);
  } finally {
    return result;
  }
}

export function transformDateOut(dateOut) {
  //check the hour and minute
  var hour = dateOut.getHours();
  var minute = dateOut.getMinutes();
  if (hour === 0 && minute === 0) {
    dateOut.setHours(23, 59);
  }
}

export function getMetadataColour(textColour) {
  var colour = d3.rgb(textColour);
  if (!colour) {
    colour = "black";
  }
  return colour;
}
//========//
function _getAttrNameFromAttrList(attrList) {
  var attrName;
  attrList.forEach(function(att) {
    if (att.id === "name") {
      attrName = att.eq;
    }
  });
  return attrName;
}

function _getAttrWeightFromAttrList(attrList) {
  var attrWeight;
  attrList.forEach(function(att) {
    if (att.id === "weight") {
      attrWeight = att.eq;
    }
  });
  return attrWeight;
}

function createTransmissionDatafromDOT(graphDOT) {
  //console.log(graphDOT);
  var data = { nodes: [], links: [] };
  //create nodes

  graphDOT[0].children.forEach(function(d) {
    if (d.type === "node_stmt") {
      //process nodes
      // node (d)={'id':d}
      var id = d.node_id.id,
        name = _getAttrNameFromAttrList(d.attr_list);
      data.nodes.push({ id: id, name: name });
    } else {
      //process edges
      //link (d)={'source': 'P1', 'target': 'P2', 'weight': '0.5'}
      var source = d.edge_list[0].id,
        target = d.edge_list[1].id,
        weight = parseFloat(_getAttrWeightFromAttrList(d.attr_list));

      data.links.push({ source: source, target: target, weight: weight });
    }
  });
  return data;
}
/*
export function parseGraphMLtoJSON(gml) {
  var parser = new graphml.GraphMLParser();
  var graphdata;
  parser.parse(gml, function(err, graph) {
    graphdata = graph
    });
  var jsondata = createTransmissionDatafromGraphML(graphdata)
  return jsondata
}
*/

export function parseDOTtoJSON(dot) {
  //var parser = new graphml.GraphMLParser();
  const graphdata = dotparser(dot);
  const jsondata = createTransmissionDatafromDOT(graphdata);

  return jsondata;
}

export function getColurFromEntryID(entryID, metadata) {
  var colour;
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].entryID === entryID) {
      colour = metadata[i].colour;
    }
  }
  return colour;
}

export function filterOutNonSampleID(entryIDs, metadata) {
  var newEntryIDs = [];
  for (var i = 0; i < entryIDs.length; i++) {
    for (var j = 0; j < metadata.length; j++) {
      if (
        metadata[j].entryID === entryIDs[i] &&
        metadata[j].sampleID !== "N/A"
      ) {
        newEntryIDs.push(metadata[j]);
      }
    }
  }

  return newEntryIDs;
}
export function sessionDownloader() {
  var sessionData = {};
  return sessionData;
}

export function isTreeHasLength(treeNodes) {
  var lengths = treeNodes
    .map(function(d) {
      return d.data.length;
    })
    .filter(filterUnique);
  if (lengths.length === 1) {
    return false;
  } else {
    return true;
  }
}

export function adjustNodesPosition(nodes) {
  var newPosition,
    currentNodeDepth = 0,
    totalTreeLength = 0;

  nodes.forEach(function(d) {
    if (d.depth - currentNodeDepth === 1) {
      currentNodeDepth = d.depth;
      totalTreeLength;
    }
  });

  return newPosition;
}

export function hasParrent(node) {
  if (!node.parent) {
    return 0;
  } else {
    return node.data.length + hasParrent(node.parent);
  }
}

export function searchMetadata(metadata, searchField, searchQuery) {
  switch (searchField) {
    case "patient":
      var result = metadata.filter(function(d) {
        if (d.patID === searchQuery) {
          return d;
        }
      });
      return result;
      break;
    case "isolate":
      var result = metadata.filter(function(d) {
        if (d.sampleID === searchQuery) {
          return d;
        }
      });
      return result;
      break;
    case "location":
      var result = metadata.filter(function(d) {
        if (d.siteID === searchQuery) {
          return d;
        }
      });
      return result;
      break;
    default:
      var result = [];
      return result;
  }
}

export function searchMetadataFromMultiQuery(
  metadata,
  searchField,
  searchQuery
) {
  switch (searchField) {
    case "patient":
      let res_pat = [];
      for (var i = 0; i < searchQuery.length; i++) {
        let q = searchQuery[i];
        for (var j = 0; j < metadata.length; j++) {
          if (metadata[j].patID === q) {
            res_pat.push(metadata[j]);
            //break ;
          }
        }
      }
      return res_pat;
      break;
    case "isolate":
      let res_iso = [];
      for (var i = 0; i < searchQuery.length; i++) {
        let q = searchQuery[i];
        for (var j = 0; j < metadata.length; j++) {
          if (metadata[j].sampleID === q) {
            res_iso.push(metadata[j]);
            //break ;
          }
        }
      }
      return res_iso;
      break;
    case "location":
      let res_loc = [];
      for (var i = 0; i < searchQuery.length; i++) {
        let q = searchQuery[i];
        for (var j = 0; j < metadata.length; j++) {
          if (metadata[j].siteID === q) {
            res_loc.push(metadata[j]);
            //break ;
          }
        }
      }
      return res_loc;
      break;
    default:
      var result = [];
      return result;
  }
}

export function getFloorplanName(levelID) {
  var levelNumber = levelID.split("_")[1];
  if (levelNumber === 1 || levelNumber === "1") {
    return "Map";
  } else {
    return "Map (level " + levelNumber + ")";
  }
}

export function getDateRangeOnExtent(dateRange, dateExtent, defaultRange) {
  if (dateRange[0] && dateRange[1] && dateExtent) {
    if (dateRange[0] <= dateExtent[0] && dateRange[1] >= dateExtent[1]) {
      return dateExtent;
    } else {
      return dateRange;
    }
  } else if (dateRange[0] && dateRange[1] && !dateExtent) {
    return dateRange;
  } else {
    return defaultRange;
  }
}

export function getOptimumDimensionFactors(num) {
  if (num > 0) {
    var col = Math.ceil(Math.sqrt(num)),
      row = Math.ceil(num / col);
    return [col, row];
  } else {
    return [undefined, undefined];
  }
}

function createMatrix(ncol, nrow) {
  //make grid matrix; [[0,0], [0,1], ... [3,3]]
  var res_matrix = [],
    cols = d3.range(0, ncol, 1),
    rows = d3.range(0, nrow, 1);

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    for (var j = 0; j < cols.length; j++) {
      var col = cols[j];
      res_matrix.push([col, row]);
    }
  }
  return res_matrix;
}

export function categorizeThem_v1(arr, numCat) {
  var cat = {},
    num = 1;
  for (var i = 0; i < arr.length; i++) {
    if (num <= numCat) {
      cat[arr[i]] = num;
      num = num + 1;
    } else if (num > numCat) {
      num = 1;
      cat[arr[i]] = num;
      num = num + 1;
    } else {
      cat[arr[i]] = num;
    }
  }
  return cat;
}

export function categorizeThem(arr, dim) {
  //in locations;[icu, ward, ... locZ] , dimension;[4,4]
  //out {icu:{x:x_grid, y:y_grid}, ...}
  var grid_obj = {},
    grid_matrix = createMatrix(dim[0], dim[1]);
  for (var i = 0; i < arr.length; i++) {
    var loc = arr[i],
      grid_val = grid_matrix[i];
    grid_obj[loc] = { x: grid_val[0], y: grid_val[1] };
  }
  return grid_obj;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomize(uniqArr) {
  //in locations list, for each make random index x and y
  //x: randomly move 5px to left or right (max 10px)
  //y: randomly move 5px to top or bottom (max 10px)
  //out res = {di:{x:3, y:4}, dj:{x:3, y:4}}
  var res = {};
  uniqArr.forEach(function(d) {
    res[d] = {
      x: getRandomArbitrary(0.45, 0.55),
      y: getRandomArbitrary(0.45, 0.55),
    };
  });
  return res;
}

export function updateTransData(sourceID, targetID, data, weight, option) {
  //console.log('data', data);
  switch (option) {
    case "remove":
      var newLinks = data.links.filter(function(d) {
        if (d.source === sourceID && d.target === targetID) {
          return false;
        } else {
          return true;
        }
      });
      var newData = { nodes: data.nodes, links: newLinks };
      return newData;
      break;
    default:
      //adding new edge
      var newLinks = data.links,
        newSource,
        newTarget;
      //check wether the id is in node is, if no skip, if yes continue

      for (var i = 0; i < data.nodes.length; i++) {
        if (newSource === undefined || newTarget === undefined) {
          //if its initial search
          if (data.nodes[i].id === sourceID) {
            newSource = data.nodes[i].id;
          }

          if (data.nodes[i].id === targetID) {
            newTarget = data.nodes[i].id;
          }
        } else {
          break;
        }
      }

      if (newSource && newTarget) {
        newLinks.push({ source: newSource, target: newTarget, weight: weight });
        var newData = { nodes: data.nodes, links: newLinks };
        return newData;
      } else {
        return data;
      }

    //console.log(newSource, newTarget);
  }
}

export function getMetadataFromNodeName(name, metadata) {
  var res;
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].sampleID === name) {
      res = metadata[i];
      break;
    }
  }
  //console.log(res)
  return res;
}

// common function =============================================================
export async function fetchDataset(metadataURL, mapURL, treeURL, transURL) {
  //if no file, url will return undefined
  //read each fileURL then save
  var bulkSet = {},
    activeChartMulti = {
      gantt: { show: false },
      simulatedMap: { show: false },
      floorplan: { show: false, levels: [2] },
      brush: { show: false },
      idxCol: { show: false },
      tree: { show: false },
      transmission: { show: false },
      table: { show: false },
      bar: { show: false },
    };
  // 1st process metadata set
  if (metadataURL) {
    var res;
    var metadata = await csv(metadataURL);
    if (!validateMetadata(metadata)) {
      res = {
        metadata: null,
        userColor: null,
        patientColor: null,
        isolateColor: null,
        siteColor: null,
        dateRange: null,
        daysRange: null,
        patients: null,
        locations: null,
        isolates: null,
      };
    } else {
      var patientColour = {},
        userColor = {},
        siteColour = {},
        allDates = [],
        patients = [],
        locations = [],
        isolates = [];

      metadata.forEach((d) => {
        d.entryID = +d.entryID;

        var transformedDateIn = metadataDateValidation(d.dateIn, "admission"),
          transformedDateOut = metadataDateValidation(d.dateOut, "discharge"),
          transformDateCol = metadataDateValidation(
            d.samplingDate,
            "collection"
          );

        d.dateIn = transformedDateIn ? transformedDateIn : transformDateCol;
        d.dateOut = transformedDateOut ? transformedDateOut : transformDateCol;
        d.samplingDate = transformDateCol;
        d.siteLevel = +d.siteLevel;
        //create group of patient, location and sample
        patients.push(d.patID);
        locations.push(d.siteID);
        isolates.push(d.sampleID);
        allDates.push(d.dateIn, d.dateOut, d.samplingDate);
        //add color at userColor
        userColor[d.colourLegend] = getMetadataColour(d.colour);
        //patientColour[d.patID]=util.getMetadataColour(d.colour)
        //siteColour[d.siteID]=util.getMetadataColour(d.colour)
      });
      //filtering the group
      patients = patients.filter(filterUnique);
      locations = locations.filter(filterUnique);
      isolates = isolates.filter(filterUnique);
      allDates = allDates.filter(filterUndefinedNull);

      //generate color category
      patientColour = generateColor(patients);
      siteColour = generateColor(locations);

      //generate range date for date scale
      var arbtoday = new Date(),
        arbtomorrow = new Date();
      arbtomorrow.setDate(arbtoday.getDate() + 1);
      var dateRange =
        d3.extent(allDates)[0] && d3.extent(allDates)[1]
          ? d3.extent(allDates)
          : [arbtoday, arbtomorrow];

      res = {
        metadata: metadata,
        userColor: userColor,
        patientColor: patientColour,
        siteColor: siteColour,
        dateRange: dateRange,
        patients: patients,
        isolates: isolates,
        locations: locations,
      };
    }
    bulkSet["metadata"] = res;

    activeChartMulti["gantt"].show = true;
    activeChartMulti["brush"].show = true;
    activeChartMulti["idxCol"].show = true;
    activeChartMulti["simulatedMap"].show = true;
    activeChartMulti["table"].show = true;
    //console.log('fecth check 1st meta result', res);
  }

  if (mapURL) {
    var floorplan = await json(mapURL);
    //floorplan.features.forEach(function(d) {
    //  var level = d.properties.level.split(',')
    //  //console.log(level);
    //  for (var i = 0; i < level.length; i++) {level[i] = parseInt(level[i])}
    //  d.properties.level = level
    //})
    bulkSet["floorplan"] = floorplan;
    activeChartMulti["floorplan"].show = true;
    //console.log('fecth check 2nd map result', floorplan);
  }

  if (treeURL) {
    var tree = await text(treeURL);
    bulkSet["tree"] = tree;
    activeChartMulti["tree"].show = true;
    //console.log('fecth check 3rd tree result', tree);
  }

  if (transURL) {
    var dotURL = await text(transURL),
      transmissionData = parseDOTtoJSON(dotURL);
    bulkSet["transmission"] = transmissionData;
    activeChartMulti["transmission"].show = true;
    //console.log('fecth check 4th trans result', transmissionData);
  }
  //what can we do with this activechartmulti for loading it directly to reload?
  return bulkSet;
}

export function fillWithColorIndex(el, indexColorProps) {
  //in: element of arr; d || indexColorProps: {type: 'patient', color: {patA: 'black' ...}}
  //out: color; 'black'
  var res;
  switch (indexColorProps.type) {
    case "user":
      res = indexColorProps.color[el.colourLegend];
      break;
    case "patient":
      res = indexColorProps.color[el.patID];
      break;
    case "location":
      res = indexColorProps.color[el.siteID];
      break;
    default:
    //do nothing
  }
  return res;
}

export function count_overlap_days(patA_arr, patB_arr) {
  //count the number days that patient A with patient B is overlap in the same loc
  //in: patA_meta_records;arr patB_meta_records;arr (patA, loc, dateIn, dateOut)
  //out: number
  var res;
  if (
    patA_arr.patID !== patB_arr.patID &&
    patA_arr.siteID === patB_arr.siteID
  ) {
    return res;
  }
}

export function getXYfromMetadata(name, metadata) {
  var res = undefined;
  for (var i = 0; i < metadata.length; i++) {
    if (metadata[i].sampleID === name) {
      res = [metadata[i].x, metadata[i].y];
      break;
    }
  }
  return res;
}

//=============
