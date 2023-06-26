/* ============================================================================
props.loadTreeData(phylotree);//
============================================================================ */
import React, { useEffect, useRef } from "react";
import { extent } from "d3-array";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { event as currentEvent } from "d3";
import { zoom } from "d3-zoom";
import { cluster } from "d3-hierarchy";
import "./style_PhyloTree.css";
import { Empty, Button } from "antd";
import { symbol, symbolDiamond } from "d3-shape";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  tree_pathGenerator,
  getColorScaleByObject,
  isTreeHasLength,
  treeBranchHasParrent,
} from "../utils/utils";

const PhyloTreeChart = (props) => {
  // this constructror will be recalled when props from parent change, so just put it here
  const phylotreeSVGRef = useRef();
  const phylotreeContainerRef = useRef();
  const zoomStateRef = useRef(null);
  const initialScaleRef = useRef(null);
  const yScaleRef = useRef(null);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const phylotreeData = props.data;
  const container = select(phylotreeContainerRef.current);
  const svg = select(phylotreeSVGRef.current);
  const margin = { top: 30, right: 50, bottom: 50, left: 30 };
  const container_w = observedWidth;
  const container_h = observedHeight;
  const tree_width = container_w - margin.left - margin.right;
  const tree_height = container_h - margin.top - margin.bottom - 10;
  const symbolGenerator = symbol()
    .type(symbolDiamond)
    .size(10);

  //SETTINGS
  const isUserStartResize = props.phylotreeSettings.isUserStartResize;
  const nodeSize = props.phylotreeSettings.nodeSize;
  const textSize = props.phylotreeSettings.textSize;
  const textOffset = props.phylotreeSettings.textOffset;
  const isScaleShown = props.phylotreeSettings.isScaleShown;
  const customScale = props.phylotreeSettings.customScale;
  const scaleFactor = props.phylotreeSettings.scaleFactor;

  //USE-EFFECTS
  useEffect(() => {
    if (
      observedWidth &&
      observedHeight &&
      !isUserStartResize &&
      !props.isUserRedraw
    ) {
      //when initial draw
      draw();
    } else if (
      observedWidth &&
      observedHeight &&
      !isUserStartResize &&
      props.isUserRedraw
    ) {
      //when user click redraw
      draw();
      // reset currentEvent.zoom transform
    } else {
      //console.log("hide and remove");
      select("#tree_svgGroup").remove();
      select("#phylotree-zoomButton-container").style("display", "none");
      select("#phylotree-no-drawing").style("display", "block");
    }
  }, [observedWidth, observedHeight, isUserStartResize, props.isUserRedraw]);
  useEffect(() => {
    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    } else if (props.selectedData && props.selectedData.length === 0) {
      clearSelectedData();
    }
  }, [props.selectedData]);
  useEffect(() => {
    if (props.colorScale.colorType) {
      svg.selectAll(".tree_nodeCircle").attr("fill", (d) => {
        let obj = props.isolateData.get(d.data.name);
        let col = getColorScaleByObject(obj, props.colorScale);
        return col;
      });
    }
  }, [props.colorScale]);
  useEffect(() => {
    if (nodeSize) {
      if (props.selectedData && props.selectedData.length > 0) {
        svg.selectAll(".tree_nodeCircle").attr("r", () => nodeSize);
        updateBySelectedData();
      } else {
        svg.selectAll(".tree_nodeCircle").attr("r", () => nodeSize);
      }
    }
  }, [nodeSize]);
  useEffect(() => {
    if (textSize) {
      svg.selectAll(".tree_nodeLabel").attr("font-size", () => textSize + "px");
    }
  }, [textSize]);
  useEffect(() => {
    if (textOffset) {
      svg
        .selectAll(".tree_nodeLabel")
        .attr("transform", () => "translate(" + textOffset + "," + 0 + ")");
    }
  }, [textOffset]);
  //Showing scale
  useEffect(() => {
    svg.selectAll("#tree_scale_line").style("opacity", isScaleShown ? 1 : 0);
    svg.selectAll("#tree_scale_text").style("opacity", isScaleShown ? 1 : 0);
  }, [isScaleShown]);
  //Updating scale
  useEffect(() => {
    if (customScale && yScaleRef) {
      svg
        .selectAll("#tree_scale_line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr(
          "x2",
          customScale && yScaleRef.current
            ? yScaleRef.current(customScale)
            : yScaleRef.current(initialScaleRef)
        )
        .attr("y2", 0);
      svg
        .selectAll("#tree_scale_text")
        .text(customScale ? customScale : initialScaleRef.current);
    }
  }, [customScale]);

  //DRAWING
  function draw() {
    // projection the default position x and y
    const clusterLayout = cluster().size([tree_height, tree_width]);
    // .nodeSize([10]);
    // .separation(function(a, b) {
    //   return 1;
    // });
    let treeLayout = clusterLayout(phylotreeData);
    //treeLayout = clusterLayout(treeLayout);

    const tree_nodes = treeLayout.descendants();
    const tree_links = treeLayout.links();

    //scalling
    const treeHasLength = isTreeHasLength(tree_nodes);
    const branchLengthRange = tree_nodes.map((d) => {
      if (treeHasLength) {
        return treeBranchHasParrent(d);
      }
    });

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

    // const y_axis = axisBottom()
    //   .scale(y_scale)
    //   .ticks();

    //clean previous drawing artifacts
    select("#phylotree-no-drawing").style("display", "none");
    select("#phylotree-zoomButton-container").style("display", "block");
    select("#tree_svgGroup").remove();

    //set svg attributes
    svg
      .attr("width", tree_width + margin.left + margin.right)
      .attr("height", tree_height + margin.top + margin.bottom);

    //make group root of svg for transformation purpose
    let svgGroup = svg
      .append("g")
      .attr("id", "tree_svgGroup")
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
          return (
            "translate(" + margin.left + "," + margin.top + ")" + "scale(1)"
          );
        }
      });

    //make links group for link's line and label, this must be rendered beneath the nodes group
    let linksGroup = svgGroup.append("g").attr("id", "tree_linksGroup");
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

    //make nodes group and draw nodes on it
    let nodesGroup = svgGroup.append("g").attr("id", "tree_nodesGroup");
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
      .attr("fill", "red")
      .on("click", (d) => {
        let currentLeaves = d.leaves();
        if (currentLeaves && currentLeaves.length > 0) {
          let leafNames = currentLeaves.map((l) => l.data.name);
          props.setSelectedData(leafNames);
        }
      });

    //draw leaf node (taxa circle)
    nodesGroup
      .selectAll("g.tree_leaf.node")
      .append("circle")
      .attr("class", "tree_nodeCircle")
      .attr("r", () => nodeSize)
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .attr("cursor", "pointer")
      .style("opacity", 1)
      .attr("fill", (d) => {
        let obj = props.isolateData.get(d.data.name);
        let col = getColorScaleByObject(obj, props.colorScale);
        return col;
      })
      .on("click", (d) => {
        props.setSelectedData([d.data.name]);
      })
      .append("title")
      .text((d) => `isolate: ${d.data.name}`);

    // draw label
    nodesGroup
      .selectAll("g.tree_leaf.node")
      .append("text")
      .attr("class", "tree_nodeLabel")
      .attr("dx", () => textOffset)
      .attr("dy", 0)
      .attr("text-anchor", "start")
      .attr("font-size", () => textSize)
      .attr("fill", "black")
      .text((d) => d.data.name);

    // draw scale
    let scaleGroup = svgGroup.append("g").attr("id", "tree_scaleGroup");
    scaleGroup
      .append("g")
      .attr("transform", "translate(0," + (tree_height + 30) + ")")
      .append("line")
      .attr("id", "tree_scale_line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr(
        "x2",
        customScale ? y_scale(customScale) : y_scale(initialScaleRef.current)
      )
      .attr("y2", 0)
      .attr("stroke", "black")
      .style("opacity", isScaleShown ? 1 : 0);

    //scale text
    scaleGroup
      .append("g")
      .attr("transform", "translate(0," + (tree_height + 20) + ")")
      .append("text")
      .attr("id", "tree_scale_text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", "10px")
      .text(customScale ? customScale : initialScaleRef.current)
      .style("opacity", isScaleShown ? 1 : 0);

    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    }

    //zoom functionality
    const zoomHandler = zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", () => {
        zoomStateRef.current = currentEvent.transform;
        select("#tree_svgGroup").attr("transform", currentEvent.transform);
      })
      .filter(function() {
        return !currentEvent.button && currentEvent.type !== "wheel";
      });

    container.select("#phylotree-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });

    container.select("#phylotree-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.5);
    });

    svg.call(zoomHandler);
  }

  function updateBySelectedData() {
    svg
      .selectAll(".tree_nodeCircle")
      .attr("r", (d) => {
        if (props.selectedData.indexOf(d.data.name) !== -1) {
          return nodeSize * 1.5;
        } else {
          return nodeSize;
        }
      })
      .style("opacity", (d) => {
        if (props.selectedData.indexOf(d.data.name) !== -1) {
          return 1;
        } else {
          return 0.2;
        }
      });
  }
  function clearSelectedData() {
    svg
      .selectAll(".tree_nodeCircle")
      .attr("r", () => nodeSize)
      .style("opacity", () => 1);
  }

  //HANDLERS
  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };

  return (
    <React.Fragment>
      <div id="phylotreeContainer" ref={phylotreeContainerRef}>
        <div id="phylotree-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="phylotree-zoomButton-container">
          <Button
            id={"phylotree-zoomIn"}
            size={"medium"}
            shape={"circle"}
            icon={<ZoomInOutlined />}
          ></Button>
          <Button
            id={"phylotree-zoomOut"}
            size={"medium"}
            shape={"circle"}
            icon={<ZoomOutOutlined />}
          ></Button>
          <Button
            title={"Clear selection"}
            shape={"circle"}
            id={"phylotree-clearSelection"}
            size={"medium"}
            icon={<ClearOutlined />}
            onClick={clearSelectedDataHandler}
          ></Button>
        </div>
        <div id="phylotree-tooltip"></div>
        <svg id="phylotree-svg" ref={phylotreeSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default PhyloTreeChart;
