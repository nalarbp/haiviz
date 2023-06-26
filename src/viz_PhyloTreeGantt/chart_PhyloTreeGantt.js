/* ============================================================================
props.loadTreeData(phylotree);//
============================================================================ */
import React, { useEffect, useRef } from "react";
import { mean, extent, ascending, max } from "d3-array";
import { select } from "d3-selection";
import { scaleLinear, scaleTime } from "d3-scale";
import { event as currentEvent } from "d3";
import { zoom } from "d3-zoom";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { cluster } from "d3-hierarchy";
import "./style_PhyloTreeGantt.css";
import { Empty, Button } from "antd";
import { symbol, symbolCircle } from "d3-shape";
import usePrevious from "../react_hooks/usePrevious-hook";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  tree_pathGenerator,
  getColorScaleByObjectAndColType,
  isTreeHasLength,
  treeBranchHasParrent,
} from "../utils/utils";

const _ = require("lodash");
const moment = extendMoment(Moment);
const PhyloTreeGanttChart = (props) => {
  // this constructror will be recalled when props from parent change, so just put it here
  const phylotreeganttSVGRef = useRef();
  const phylotreeganttContainerRef = useRef();
  const zoomStateRef = useRef(null);
  const initialScaleRef = useRef(null);
  const yScaleRef = useRef(null);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const phylotreeData = props.phylotreeData;
  const isolateData = _.cloneDeep(Array.from(props.isolateData.values()));
  const tree_percentW = 44;
  const strip_percentW = 12;
  const gantt_percentW = 44;
  const container = select(phylotreeganttContainerRef.current);
  const svg = select(phylotreeganttSVGRef.current);
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const treeGantt_width = observedWidth - margin.left - margin.right;
  const treeGantt_height = observedHeight - margin.top - margin.bottom - 10;
  const tree_offset = 50;
  const tree_width = treeGantt_width * (tree_percentW / 100) - tree_offset;
  const tree_height = treeGantt_height;
  const gantt_width = treeGantt_width * (gantt_percentW / 100);
  const strip_width = treeGantt_width * (strip_percentW / 100);
  const prevDimension = usePrevious(observedWidth + observedHeight);
  const isInitialDraw = prevDimension && prevDimension < 0 ? true : false;
  const symbolGenerator = symbol()
    .type(symbolCircle)
    .size(5);

  //SETTINGS
  const isUserStartResize = props.phylotreeGanttSettings.isUserStartResize;
  const treeLabelSize = props.phylotreeGanttSettings.textSize;
  //USE-EFFECTS
  //update when initialization drawing
  useEffect(() => {
    if (isUserStartResize) {
      select("#treeGantt_svgGroup").remove();
      select("#phylotreegantt-zoomButton-container").style("display", "none");
      select("#phylotreegantt-no-drawing").style("display", "block");
    } else {
      if (isInitialDraw) {
        draw();
      } else {
        if (props.isUserRedraw) {
          draw();
        }
      }
    }
  }, [isInitialDraw, isUserStartResize, props.isUserRedraw]);
  //update when selected data is changed
  useEffect(() => {
    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    } else if (props.selectedData && props.selectedData.length === 0) {
      clearSelectedData();
    }
  }, [props.selectedData]);
  //update when color is changed
  useEffect(() => {
    if (props.colorScale.colorType) {
      //update strip color
      svg.selectAll(".treeGantt_strip").attr("fill", (d) => {
        let obj = props.isolateData.get(d.name);
        //let col = getColorScaleByObject(obj, props.colorScale);
        let col = getColorScaleByObjectAndColType(
          obj,
          props.colorScale,
          d.column
        );
        return col;
      });
      //update movement rectangle color
      if (props.colorScale.colorType === "location") {
        svg.selectAll(".treeGantt-moveLane").attr("fill", (d) => {
          let col = props.colorScale.byLocation.get(d.data.location_name);
          if (col) {
            return col;
          } else {
            if (d.location_color) {
              return d.location_color;
            } else {
              return "gray";
            }
          }
        });
      }
    }
  }, [props.colorScale]);
  //update when tree text size is changed
  useEffect(() => {
    if (treeLabelSize) {
      svg
        .selectAll(".tree_nodeLabel")
        .style("font-size", `${treeLabelSize}pt`)
        .attr("dy", treeLabelSize * 0.5);
    }
  }, [treeLabelSize]);

  //DRAWING
  function draw() {
    //console.log("draw");
    // projection the default position x and y
    const clusterLayout = cluster()
      .size([tree_height, tree_width])
      .separation(function() {
        return 2;
      });
    let treeLayout = clusterLayout(phylotreeData);
    //treeLayout = clusterLayout(treeLayout);

    const tree_nodes = treeLayout.descendants();
    const tree_links = treeLayout.links();
    const tree_leaves = treeLayout.leaves(); //name:isolateName //x:xcoordinate

    //scalling
    const treeHasLength = isTreeHasLength(tree_nodes);
    const branchLengthRange = [];
    tree_nodes.forEach((d) => {
      if (treeHasLength) {
        branchLengthRange.push(treeBranchHasParrent(d));
      }
    });
    const scaleFactor = 1;
    const branchLenExtent = extent(branchLengthRange);
    const branchDepthExtent = extent(tree_nodes.map((d) => d.depth));
    const branchLength = treeHasLength ? branchLenExtent : branchDepthExtent;
    const branchScale = branchLength[1] * scaleFactor;
    const y_scale = scaleLinear()
      .domain([0, branchScale])
      .range([0, tree_width]);

    initialScaleRef.current = branchScale;
    yScaleRef.current = y_scale;

    tree_nodes.forEach((d) => {
      if (treeHasLength) {
        d.y = y_scale(treeBranchHasParrent(d));
      } else {
        d.y = y_scale(d.depth);
      }
    });

    const max_x_pos = max(tree_leaves.map((d) => d.y)) + 10;

    // ===== CREATE SRIP DATA =====
    const strip_start_posX = tree_width + tree_offset;
    const strip_start_posY = 0;
    const strip_leaf_map = new Map();
    tree_leaves.forEach((d) => {
      strip_leaf_map.set(d.data.name, d.x);
    });
    const strip_rect_w = strip_width / 6;
    const strip_rect_h = getLeafDistance(strip_leaf_map);
    const strip_var = [
      "species",
      "sourceType",
      "location",
      "profile1",
      "profile2",
      "profile3",
    ];
    let strip_title_data = [];
    let strip_index_data = {
      label: "Strip index: ",
      x: 2,
      y: tree_height + 10,
    };
    strip_var.forEach((strip, i) => {
      let res = {
        idx: i + 1,
        label: strip,
        x: strip_start_posX + i * strip_rect_w + strip_rect_w / 2 - 2,
        y: strip_start_posY - 1,
      };
      strip_title_data.push(res);
      let indexText = `${i + 1}: ${getStripTitle(strip)}, `;
      strip_index_data.label = strip_index_data.label.concat(indexText);
    });

    let strip_data = [];
    tree_leaves.forEach((leaf) => {
      strip_var.forEach((strip, j) => {
        let obj = props.isolateData.get(leaf.data.name);
        let res = {
          name: leaf.data.name,
          column: strip,
          x: strip_start_posX + j * strip_rect_w,
          y: leaf.x - strip_rect_h / 2,
          col: getColorScaleByObjectAndColType(obj, props.colorScale, strip),
        };
        strip_data.push(res);
      });
    });
    // ===== CREATE GANTT DATA =====
    const isoColDates = isolateData.map((d) => d.isolate_colDate);
    const movementDates = props.movementData.flatMap((d) => [
      d.start_date,
      d.end_date,
    ]);
    const dateRange = extent(isoColDates.concat(movementDates));
    let ganttData = []; //{name:iso, x, y, data}
    tree_leaves.forEach((leaf) => {
      let data = getMoveDataByIsolateName(leaf.data.name, props.isolateData);
      if (data.length > 0) {
        data.forEach((d) => {
          ganttData.push({ name: leaf.data.name, data: d });
        });
      }
    });

    //scale
    const scale_x = scaleTime()
      .domain([
        moment(dateRange[0]).subtract(1, "days"),
        moment(dateRange[1]).add(1, "days"),
      ])
      .range([treeGantt_width - gantt_width, treeGantt_width]);

    //axis

    //clean previous drawing artifacts
    select("#phylotreegantt-no-drawing").style("display", "none");
    select("#phylotreegantt-zoomButton-container").style("display", "block");
    select("#treeGantt_svgGroup").remove();

    //set svg attributes
    svg
      .attr("width", treeGantt_width + margin.left + margin.right)
      .attr("height", treeGantt_height + margin.top + margin.bottom);

    //make group root of svg for transformation purpose
    let svgGroup = svg
      .append("g")
      .attr("id", "treeGantt_svgGroup")
      .attr("transform", function() {
        if (zoomStateRef.current) {
          return (
            "translate(" +
            zoomStateRef.current.x +
            "," +
            zoomStateRef.current.y +
            ")" +
            "scale(" +
            zoomStateRef.current.k +
            ")"
          );
        } else {
          return "translate(" + margin.left + "," + margin.top + ")scale(1)";
        }
      });

    //==== DRAW TREE PANEL ======================================
    let treePanelGroup = svgGroup
      .append("g")
      .attr("id", "treeGantt_treePanelGroup");

    //make links group for link's line and label, this must be rendered beneath the nodes group
    let linksGroup = treePanelGroup.append("g").attr("id", "tree_linksGroup");
    //draw link's line on it
    linksGroup
      .selectAll(".tree_link")
      .data(tree_links)
      .enter()
      .append("path")
      .attr("class", "tree_link")
      .attr("d", (d) => tree_pathGenerator(d))
      .attr("stroke", "black")
      .attr("fill", "none");

    let extensionLineGroup = treePanelGroup
      .append("g")
      .attr("id", "treeGantt_extensionLineGroup");
    extensionLineGroup
      .selectAll(".treeGantt_nodeExtensionLine")
      .data(tree_leaves)
      .enter()
      .append("line")
      .attr("class", "treeGantt_nodeExtensionLine")
      .attr("x1", (d) => d.y + 1)
      .attr("y1", (d) => d.x)
      .attr("x2", () => max_x_pos)
      .attr("y2", (d) => d.x)
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "1")
      .attr("stroke-width", "0.5px");

    //make nodes group and draw nodes on it
    let nodesGroup = treePanelGroup.append("g").attr("id", "tree_nodesGroup");
    //draw node circle
    nodesGroup
      .selectAll(".tree_node")
      .data(tree_nodes)
      .enter()
      .append("g")
      .attr("class", function(n) {
        if (n.children) {
          if (n.depth === 0) {
            return "tree_root node";
          } else {
            return "tree_inner node";
          }
        } else {
          return "tree_leaf node";
        }
      })
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    //draw internal node (branch circle)
    nodesGroup
      .selectAll("g.tree_inner.node")
      .append("path")
      .attr("class", "tree_innerNode")
      .attr("d", symbolGenerator)
      .style("cursor", "pointer")
      .style("opacity", 0)
      .attr("fill", "black")
      .on("click", (d) => {
        let currentLeaves = d.leaves();
        if (currentLeaves && currentLeaves.length > 0) {
          let leafNames = currentLeaves.map((l) => l.data.name);
          props.setSelectedData(leafNames);
        }
      });

    //draw leaf node (taxa circle)
    // nodesGroup
    //   .selectAll("g.tree_leaf.node")
    //   .append("circle")
    //   .attr("class", "tree_nodeCircle")
    //   .attr("d", symbolGenerator)
    //   .style("cursor", "pointer")
    //   .attr("fill", "black")
    //   .on("click", (d) => {
    //     props.setSelectedData([d.data.name]);
    //   });

    // draw label
    nodesGroup
      .selectAll("g.tree_leaf.node")
      .append("text")
      .attr("class", "tree_nodeLabel")
      .attr("text-anchor", "start")
      .attr("fill", "black")
      .attr("dy", treeLabelSize * 0.5)
      .attr("transform", function(d) {
        let gap = max_x_pos - d.y;
        return "translate(" + gap + "," + 0 + ")";
      })
      .style("opacity", 1)
      .style("font-size", `${treeLabelSize}pt`)
      .text((d) => d.data.name);

    //========= DRAW STRIP PANEL ============================
    let stripPanelGroup = svgGroup
      .append("g")
      .attr("id", "treeGantt_stripPanelGroup");

    let stripGroup = stripPanelGroup
      .append("g")
      .attr("id", "treeGantt_stripGroup");
    //draw strip rectangles
    stripGroup
      .selectAll(".treeGantt_strip")
      .data(strip_data)
      .enter()
      .append("rect")
      .attr("class", "treeGantt_strip")
      .attr("stroke", "white")
      .attr("stroke-width", "0.3px")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", strip_rect_w)
      .attr("height", strip_rect_h)
      .attr("fill", (d) => d.col)
      .style("opacity", 1)
      .append("title")
      .text((d) => d.name);

    let stripTitleGroup = stripPanelGroup
      .append("g")
      .attr("id", "treeGantt_stripTitleGroup");
    //draw strip title
    stripTitleGroup
      .selectAll(".treeGantt_stripTitle")
      .data(strip_title_data)
      .enter()
      .append("text")
      .attr("class", "treeGantt_stripTitle")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .style("font-size", "5pt")
      .style("text-anchor", "start")
      .text((d) => d.idx);

    let stripIndexGroup = stripPanelGroup
      .append("g")
      .attr("id", "treeGantt_stripIndexGroup");
    //draw strip index title
    stripIndexGroup
      .selectAll(".treeGantt_stripIndex")
      .data([strip_index_data])
      .enter()
      .append("text")
      .attr("class", "treeGantt_stripIndex")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .style("font-size", "5pt")
      .style("text-anchor", "start")
      .text((d) => d.label);

    //===== DRAW GANTT PANELL ============================
    let ganttPanelGroup = svgGroup
      .append("g")
      .attr("id", "treeGantt_ganttPanelGroup");
    //create background lane
    let backgroundLaneGroup = ganttPanelGroup
      .append("g")
      .attr("id", "treeGantt-backgroundLaneGroup");
    backgroundLaneGroup
      .selectAll(".treeGantt-backgroundLane")
      .data(tree_leaves)
      .enter()
      .append("rect")
      .attr("class", "treeGantt-backgroundLane")
      .attr("stroke", "gray")
      .attr("stroke-width", "0.5px")
      .attr("fill", "none")
      .attr("x", () => scale_x(dateRange[0]))
      .attr("y", function(d) {
        let res = strip_leaf_map.get(d.data.name) - strip_rect_h / 2;
        return res;
      })
      .attr("width", () => scale_x(dateRange[1]) - scale_x(dateRange[0]))
      .attr("height", strip_rect_h);
    //create rectangle movement
    let moveLaneGroup = ganttPanelGroup
      .append("g")
      .attr("id", "treeGantt-moveLaneGroup");
    moveLaneGroup
      .selectAll(".treeGantt-moveLane")
      .data(ganttData)
      .enter()
      .append("rect")
      .attr("class", "treeGantt-moveLane")
      .attr("x", (d) => scale_x(d.data.start_date))
      .attr("y", function(d) {
        let res = strip_leaf_map.get(d.name) - strip_rect_h / 2;
        return res;
      })
      .attr("height", strip_rect_h)
      .attr("width", (d) => {
        let diffRange = moment
          .range(d.data.start_date, d.data.end_date)
          .diff("days");
        if (diffRange === 0) {
          return (
            scale_x(d.data.end_date.endOf("day")) -
            scale_x(d.data.start_date.startOf("day"))
          );
        } else {
          return scale_x(d.data.end_date) - scale_x(d.data.start_date);
        }
      })
      .attr("fill", (d) => {
        let col = props.colorScale.byLocation.get(d.data.location_name);
        if (col) {
          return col;
        } else {
          if (d.location_color) {
            return d.location_color;
          } else {
            return "gray";
          }
        }
      })
      .style("opacity", 1)
      .append("title")
      .text((d) => d.data.location_name);

    // ========= DRAW ISOLATE COLLECTION DATE ==========
    let isoCollectionGroup = ganttPanelGroup
      .append("g")
      .attr("id", "treeGantt-isoCollectionGroup");
    isoCollectionGroup
      .selectAll(".treeGantt-isoCollection")
      .data(isolateData)
      .enter()
      .append("circle")
      .attr("class", "treeGantt-isoCollection")
      .attr("r", 0.3 * strip_rect_h)
      .attr("fill", "black")
      .attr("cx", (d) => scale_x(d.isolate_colDate))
      .style("opacity", 1)
      .attr("cy", function(d) {
        let res = strip_leaf_map.get(d.isolate_name);
        return res;
      });

    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    }

    //zoom functionality
    const zoomHandler = zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", () => {
        zoomStateRef.current = currentEvent.transform;
        select("#treeGantt_svgGroup").attr("transform", currentEvent.transform);
      })
      .filter(function() {
        return !currentEvent.button && currentEvent.type !== "wheel";
      });

    container.select("#phylotreegantt-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });

    container.select("#phylotreegantt-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.5);
    });

    svg.call(zoomHandler);
  }

  function updateBySelectedData() {
    //update tree leaf label color
    svg.selectAll(".tree_nodeLabel").attr("fill", (d) => {
      if (props.selectedData.indexOf(d.data.name) !== -1) {
        return "red";
      } else {
        return "black";
      }
    });
    //update strip opacity
    svg.selectAll(".treeGantt_strip").style("opacity", (d) => {
      if (props.selectedData.indexOf(d.name) !== -1) {
        return 1;
      } else {
        return 0.2;
      }
    });
    //update movement opacity
    svg.selectAll(".treeGantt-moveLane").style("opacity", (d) => {
      if (props.selectedData.indexOf(d.name) !== -1) {
        return 1;
      } else {
        return 0.2;
      }
    });
    //update collection date marker opacity
    svg.selectAll(".treeGantt-isoCollection").style("opacity", (d) => {
      if (props.selectedData.indexOf(d.isolate_name) !== -1) {
        return 1;
      } else {
        return 0.2;
      }
    });
  }
  function clearSelectedData() {
    //update tree leaf label color
    svg.selectAll(".tree_nodeLabel").attr("fill", "black");
    //update strip opacity
    svg.selectAll(".treeGantt_strip").style("opacity", 1);
    //update movement opacity
    svg.selectAll(".treeGantt-moveLane").style("opacity", 1);
    //update collection date marker opacity
    svg.selectAll(".treeGantt-isoCollection").style("opacity", 1);
  }
  function getLeafDistance(leaves) {
    //leaves: map
    //get list of sorted leaf's x position
    const leaves_x = _.cloneDeep(Array.from(leaves.values()));
    if (leaves_x && leaves_x.length > 0) {
      let sorted_leaves_x = leaves_x.sort((a, b) => ascending(a, b));
      let distances = [];
      for (var i = 1; i < sorted_leaves_x.length; i++) {
        let curr = sorted_leaves_x[i];
        let prev = sorted_leaves_x[i - 1];
        let dist = curr - prev;
        distances.push(dist);
      }
      let avg_dist = mean(distances);
      return avg_dist;
    } else {
      alert("Error in getting distance between tree leaf");
      return null;
    }
  }

  function getMoveDataByIsolateName(isoName, isoData) {
    let sourceName = isoData.get(isoName).isolate_sourceName;
    let moveDataList = props.movementData.filter(
      (d) => d.source_name === sourceName
    );
    return moveDataList;
  }

  //HANDLERS
  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };

  //UTILS
  const getStripTitle = (title) => {
    switch (title) {
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
        return "N/A";
    }
  };

  return (
    <React.Fragment>
      <div id="phylotreeganttContainer" ref={phylotreeganttContainerRef}>
        <div id="phylotreegantt-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="phylotreegantt-zoomButton-container">
          <Button
            id={"phylotreegantt-zoomIn"}
            size={"medium"}
            shape={"circle"}
            icon={<ZoomInOutlined />}
          ></Button>
          <Button
            id={"phylotreegantt-zoomOut"}
            size={"medium"}
            shape={"circle"}
            icon={<ZoomOutOutlined />}
          ></Button>
          <Button
            title={"Clear selection"}
            shape={"circle"}
            id={"phylotreegantt-clearSelection"}
            size={"medium"}
            icon={<ClearOutlined />}
            onClick={clearSelectedDataHandler}
          ></Button>
        </div>
        <div id="phylotreegantt-tooltip"></div>
        <svg id="phylotreegantt-svg" ref={phylotreeganttSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default PhyloTreeGanttChart;
