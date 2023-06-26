/* ============================================================================
props.loadTreeData(phylotree);//
============================================================================ */
import React, { useEffect, useRef } from "react";
import { max } from "d3-array";
import { select } from "d3-selection";
import { event as currentEvent } from "d3";
import { zoom } from "d3-zoom";
import { cluster } from "d3-hierarchy";
import "./style_PhyloTree.css";
import { Empty, Button } from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { getColorScaleByObject } from "../utils/utils";

const PhyloTreeChart_radial = (props) => {
  // this constructror will be recalled when props from parent change, so just put it here
  const phylotreeSVGRef = useRef();
  const phylotreeContainerRef = useRef();
  const zoomStateRef = useRef(null);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const phylotreeData = props.data;
  const container = select(phylotreeContainerRef.current);
  const svg = select(phylotreeSVGRef.current);
  const margin = { top: 30, right: 50, bottom: 50, left: 30 };
  const container_w = observedWidth;
  const tree_width = container_w - margin.left - margin.right;

  //SETTINGS
  const isUserStartResize = props.phylotreeSettings.isUserStartResize;
  const nodeSize = props.phylotreeSettings.nodeSize;
  const textSize = props.phylotreeSettings.textSize;
  const textOffset = props.phylotreeSettings.textOffset;
  const outerRadius = 100;
  const innerRadius = 50;

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

  //DRAWING
  function draw() {
    // projection the default position x and y
    const clusterLayout = cluster()
      .size([50, 50])
      .nodeSize([nodeSize])
      .separation(function() {
        return 1;
      });
    let treeLayout = clusterLayout(phylotreeData);
    setRadius(
      phylotreeData,
      (phylotreeData.data.length = 0),
      innerRadius / maxLength(phylotreeData)
    );

    console.log(maxLength(phylotreeData));

    //treeLayout = clusterLayout(treeLayout);

    const tree_links = treeLayout.links();

    //scalling

    //clean previous drawing artifacts
    select("#phylotree-no-drawing").style("display", "none");
    select("#phylotree-zoomButton-container").style("display", "block");
    select("#tree_svgGroup").remove();

    //set svg attributes
    svg
      .attr("width", tree_width + margin.left + margin.right)
      .attr("height", tree_width + margin.left + margin.right);

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
            "translate(" +
            outerRadius +
            margin.left +
            "," +
            outerRadius +
            margin.left +
            ")" +
            "scale(1)"
          );
        }
      });

    let linkExtensionGroup = svgGroup
      .append("g")
      .attr("id", "tree_linkExtensionGroup");

    linkExtensionGroup
      .selectAll(".tree_link-extensions")
      .data(
        phylotreeData.links().filter(function(d) {
          return !d.target.children;
        })
      )
      .enter()
      .append("path")
      .attr("class", "tree_link-extensions")
      .each(function(d) {
        d.target.linkExtensionNode = this;
      })
      .attr("d", linkExtensionConstant);

    //make links group for link's line and label, this must be rendered beneath the nodes group
    let linksGroup = svgGroup.append("g").attr("id", "tree_linksGroup");
    //draw link's line on it
    linksGroup
      .selectAll(".tree_link")
      .data(tree_links)
      .enter()
      .append("path")
      .attr("class", "tree_link")
      .each(function(d) {
        d.target.linkNode = this;
      })
      .attr("d", linkConstant)
      .attr("stroke", "black")
      .attr("fill", "none");

    //make nodes group and draw nodes on it
    // let nodesGroup = svgGroup.append("g").attr("id", "tree_nodesGroup");
    // //draw node circle
    // nodesGroup
    //   .selectAll(".tree_node")
    //   .data(tree_nodes)
    //   .enter()
    //   .append("g")
    //   .attr("class", function(n) {
    //     if (n.children) {
    //       if (n.depth === 0) {
    //         return "tree_root node";
    //       } else {
    //         return "tree_inner node";
    //       }
    //     } else {
    //       return "tree_leaf node";
    //     }
    //   })
    //   .attr("transform", function(d) {
    //     return "translate(" + d.y + "," + d.x + ")";
    //   });

    //draw internal node (branch circle)
    // nodesGroup
    //   .selectAll("g.tree_inner.node")
    //   .append("path")
    //   .attr("class", "tree_innerNode")
    //   .attr("d", symbolGenerator)
    //   .style("cursor", "pointer")
    //   .attr("fill", "red")
    //   .on("click", d => {
    //     let currentLeaves = d.leaves();
    //     if (currentLeaves && currentLeaves.length > 0) {
    //       let leafNames = currentLeaves.map(l => l.data.name);
    //       props.setSelectedData(leafNames);
    //     }
    //   });
    //
    // //draw leaf node (taxa circle)
    // nodesGroup
    //   .selectAll("g.tree_leaf.node")
    //   .append("circle")
    //   .attr("class", "tree_nodeCircle")
    //   .attr("r", d => nodeSize)
    //   .attr("stroke", "black")
    //   .attr("stroke-width", "1px")
    //   .attr("cursor", "pointer")
    //   .style("opacity", 1)
    //   .attr("fill", d => {
    //     let obj = props.isolateData.get(d.data.name);
    //     let col = getColorScaleByObject(obj, props.colorScale);
    //     return col;
    //   })
    //   .on("click", d => {
    //     props.setSelectedData([d.data.name]);
    //   })
    //   .append("title")
    //   .text(d => `isolate: ${d.data.name}`);
    //
    // // draw label
    // nodesGroup
    //   .selectAll("g.tree_leaf.node")
    //   .append("text")
    //   .attr("class", "tree_nodeLabel")
    //   .attr("dx", d => textOffset)
    //   .attr("dy", 0)
    //   .attr("text-anchor", "start")
    //   .attr("font-size", d => textSize)
    //   .attr("fill", "black")
    //   .text(d => d.data.name);

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

  function setRadius(d, y0, k) {
    d.radius = (y0 += d.data.length) * k;
    if (d.children)
      d.children.forEach(function(d) {
        setRadius(d, y0, k);
      });
  }
  function maxLength(d) {
    return d.data.length + (d.children ? max(d.children, maxLength) : 0);
  }

  function linkConstant(d) {
    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
  }

  function linkExtensionConstant(d, innerRadius) {
    return linkStep(d.target.x, d.target.y, d.target.x, innerRadius);
  }

  // Like d3.svg.diagonal.radial, but with square corners.
  function linkStep(startAngle, startRadius, endAngle, endRadius) {
    var c0 = Math.cos((startAngle = ((startAngle - 90) / 180) * Math.PI)),
      s0 = Math.sin(startAngle),
      c1 = Math.cos((endAngle = ((endAngle - 90) / 180) * Math.PI)),
      s1 = Math.sin(endAngle);
    return (
      "M" +
      startRadius * c0 +
      "," +
      startRadius * s0 +
      (endAngle === startAngle
        ? ""
        : "A" +
          startRadius +
          "," +
          startRadius +
          " 0 0 " +
          (endAngle > startAngle ? 1 : 0) +
          " " +
          startRadius * c1 +
          "," +
          startRadius * s1) +
      "L" +
      endRadius * c1 +
      "," +
      endRadius * s1
    );
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

export default PhyloTreeChart_radial;
