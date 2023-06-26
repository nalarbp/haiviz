/* ============================================================================
Transmission graph card:
- when dataset for chart is available, render transmission graph viewer
- what you need: zoom by button, drag by mouse, select area using polybrush,
-  change link distance, filter by link's weight, change force charge strength
// at initial process (dimensions is null) skip drawing, wait until dimensions is available
// run drawing when only: change in width, props.data
// when zoom, select the root svgGroup, translate using zoomTransform not re-render/set new state (this approach is faster!)
// iterate draw function when only page refreshed
//
============================================================================ */
import React, { useEffect, useRef } from "react";
import { line, curveNatural } from "d3-shape";
import { select } from "d3-selection";
import { event as currentEvent } from "d3";
import { filterUnique, getColorScaleByObject } from "../utils/utils";
import { Button, Empty } from "antd";
import { zoom } from "d3-zoom";
import "./style_TransGraph.css";
import {
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceLink,
  forceCollide,
  forceRadial,
} from "d3-force";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const _ = require("lodash");

const TransGraph = (props) => {
  console.log("transgraph comp");
  //DRAWING CONSTRUCTOR
  const transmission = _.cloneDeep(props.data);
  const transmissionSVGRef = useRef();
  const transmissionContainerRef = useRef();
  const zoomStateRef = useRef(null);
  const container = select(transmissionContainerRef.current);
  const svg = select(transmissionSVGRef.current);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const container_w = observedWidth;
  const container_h = observedHeight;
  const margin = { top: 10, right: 10, bottom: 10, left: 20 };
  const trans_width = container_w - margin.left - margin.right;
  const trans_height = container_h - margin.top - margin.bottom - 10;
  const curve = line().curve(curveNatural);
  const arrowHeadPath = line();

  //SETTINGS
  const isUserStartResize = props.transgraphSettings.isUserStartResize;
  const nodeSize = props.transgraphSettings.nodeSize;
  const textSize = props.transgraphSettings.textSize;
  const textOffset = props.transgraphSettings.textOffset;
  const linkThreshold = props.transgraphSettings.transgraphIsDownloading;
  const isLinkLabelShown = props.transgraphSettings.isLinkLabelShown;

  //console.log(transmission);

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
      select("#trans_svgGroup").remove();
      select("#transgraph-zoomButton-container").style("display", "none");
      select("#transgraph-no-drawing").style("display", "block");
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
    if (nodeSize) {
      if (props.selectedData && props.selectedData.length > 0) {
        svg.selectAll(".trans_nodeCircle").attr("r", (d) => nodeSize);
        updateBySelectedData();
      } else {
        svg.selectAll(".trans_nodeCircle").attr("r", (d) => nodeSize);
      }
    }
  }, [nodeSize]);
  useEffect(() => {
    if (props.colorScale.colorType) {
      svg.selectAll(".trans_nodeCircle").attr("fill", (d) => {
        let obj = props.isolateData.get(d.name);
        let col = getColorScaleByObject(obj, props.colorScale);
        return col;
      });
    }
  }, [props.colorScale]);
  useEffect(() => {
    if (textSize) {
      const svg = select(transmissionSVGRef.current);
      svg
        .selectAll(".trans_nodeLabel")
        .attr("font-size", (d) => textSize + "px");
    }
  }, [textSize]);

  useEffect(() => {
    svg.selectAll(".trans_linksLabel").style("opacity", (d) => {
      if (isLinkLabelShown) {
        if (d.weight && d.weight <= linkThreshold) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });
  }, [isLinkLabelShown]);

  useEffect(() => {
    if (textOffset) {
      const svg = select(transmissionSVGRef.current);
      //re-draw nodes
      svg
        .selectAll(".trans_nodeLabel")
        .attr("transform", (d) => "translate(" + textOffset + "," + 0 + ")");
    }
  }, [textOffset]);
  useEffect(() => {
    //console.log("useEffect 7");
    if (linkThreshold || linkThreshold === 0) {
      svg.selectAll(".trans_link").style("opacity", (d) => {
        if (d.weight && d.weight <= linkThreshold) {
          return 1;
        } else {
          return 0;
        }
      });

      svg.selectAll(".trans_linksLabel").style("opacity", (d) => {
        if (d.weight && d.weight <= linkThreshold) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }, [linkThreshold]);

  //DRAW
  function draw() {
    forceSimulation(transmission.nodes)
      .force(
        "center",
        forceCenter()
          .x(trans_width / 2)
          .y(trans_height / 2)
      )
      .force("charge", forceManyBody().strength(-25))
      .force("collide", forceCollide().strength(1))
      .force("link", forceLink().links(transmission.links))
      .force(
        "radial",
        forceRadial()
          .radius(trans_height / 8)
          .x(trans_width / 2)
          .y(trans_height / 2)
      )
      .tick(30)
      .stop();

    //clean previous drawing artifacts
    select("#transgraph-no-drawing").style("display", "none");
    select("#transgraph-zoomButton-container").style("display", "block");
    select("#trans_svgGroup").remove();

    //set svg attributes
    svg
      .attr("width", trans_width + margin.left + margin.right)
      .attr("height", trans_height + margin.top + margin.bottom);

    //make group root of svg for transformation purpose
    let svgGroup = svg
      .append("g")
      .attr("id", "trans_svgGroup")
      .attr("transform", function(d) {
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

    //make arrow group
    svgGroup
      .append("g")
      .attr("id", "arrowGroupBlack")
      .append("defs")
      .append("marker")
      .attr("id", "trans_arrow_black")
      .attr("viewBox", [0, 0, 4, 4])
      .attr("refX", 2)
      .attr("refY", 2)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr(
        "d",
        arrowHeadPath([
          [0, 0],
          [0, 4],
          [4, 2],
        ])
      )
      .attr("fill", "black")
      .attr("stroke", "none")
      .attr("stroke-width", "1px");

    //make links group
    let linksGroup = svgGroup.append("g").attr("id", "linksGroup");
    //make links label
    linksGroup
      .selectAll(".trans_linksLabel")
      .data(transmission.links)
      .enter()
      .append("text")
      .attr("class", "trans_linksLabel")
      .attr("x", (d) => (d.target.x + d.source.x) / 2)
      .attr("y", (d) => (d.target.y + d.source.y) / 2)
      .attr("text-anchor", "start")
      .attr("font-size", (d) => textSize * 0.75)
      .attr("fill", "red")
      .text((d) => (d.weight ? d.weight.toFixed(2) : d.weight))
      .style("opacity", (d) => (isLinkLabelShown ? 1 : 0));

    //make links line
    linksGroup
      .selectAll(".trans_link")
      .data(transmission.links)
      .enter()
      .append("path")
      .attr("class", "trans_link")
      .attr("d", (d) => {
        let qPoint = computeQuadraticCurve(
          d.source.x,
          d.source.y,
          d.target.x,
          d.target.y,
          5
        );
        return curve([
          [d.source.x, d.source.y],
          qPoint,
          [d.target.x, d.target.y],
        ]);
      })
      .attr("stroke", (d) => (d.color ? d.color : "black"))
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", (d) => (d.style === "dashed" ? "2,2" : "none"))
      .style("fill", "none")
      .style("opacity", 1)
      .attr("marker-mid", (d) =>
        d.dir !== "none" ? "url(#trans_arrow_black)" : "none"
      )
      .style("opacity", 1);

    //make nodes group and draw nodes on it
    let nodesGroup = svgGroup.append("g").attr("id", "nodesGroup");
    //draw node circle
    nodesGroup
      .selectAll(".trans_nodeCircle")
      .data(transmission.nodes)
      .enter()
      .append("circle")
      .attr("class", "trans_nodeCircle")
      .attr("r", nodeSize)
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .style("cursor", "move")
      .style("opacity", "0.9")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", (d) => {
        let obj = props.isolateData.get(d.name);
        let col = getColorScaleByObject(obj, props.colorScale);
        return col;
      })
      .on("click", (d) => {
        props.setSelectedData([d.name]);
      })
      .append("title")
      .text((d) => `isolate: ${d.name}`);

    // draw label
    nodesGroup
      .selectAll(".trans_nodeLabel")
      .data(transmission.nodes)
      .enter()
      .append("text")
      .attr("class", "trans_nodeLabel")
      .attr("x", (d) => d.x + textOffset)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "start")
      .attr("font-size", (d) => textSize)
      .attr("fill", "black")
      .style("opacity", 1)
      .text((d) => d.name);

    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    }

    //zoom functionality
    const zoomHandler = zoom()
      .scaleExtent([0.1, 6])
      .on("zoom", () => {
        //select svg group route and transform using zoomstate
        zoomStateRef.current = currentEvent.transform;
        select("#trans_svgGroup").attr("transform", currentEvent.transform);
      })
      .filter(function() {
        return !currentEvent.button && currentEvent.type !== "wheel";
      });

    container.select("#transgraph-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });

    container.select("#transgraph-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.75);
    });

    svg.call(zoomHandler);
  }
  function updateBySelectedData() {
    svg.selectAll(".trans_nodeCircle").style("opacity", (d) => {
      if (props.selectedData.indexOf(d.name) !== -1) {
        return 1;
      } else {
        return 0.2;
      }
    });
    svg.selectAll(".trans_link").style("opacity", (d) => {
      if (
        props.selectedData.indexOf(d.source.name) !== -1 ||
        props.selectedData.indexOf(d.target.name) !== -1
      ) {
        return 1;
      } else {
        return 0.2;
      }
    });
    if (isLinkLabelShown) {
      svg.selectAll(".trans_linksLabel").style("opacity", (d) => {
        if (
          props.selectedData.indexOf(d.source.name) !== -1 ||
          props.selectedData.indexOf(d.target.name) !== -1
        ) {
          return 1;
        } else {
          return 0.2;
        }
      });
    }
  }
  function clearSelectedData() {
    svg.selectAll(".trans_nodeCircle").style("opacity", (d) => 1);
    svg.selectAll(".trans_link").style("opacity", (d) => 1);
    svg.selectAll(".trans_linksLabel").style("opacity", (d) => 1);
  }
  function computeQuadraticCurve(p1x, p1y, p2x, p2y, offset) {
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

  //HANDLERS
  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };

  return (
    <React.Fragment>
      <div id="transmissionContainer" ref={transmissionContainerRef}>
        <div id="transgraph-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="transgraph-zoomButton-container">
          <Button
            id={"transgraph-zoomIn"}
            size={"medium"}
            shape={"circle"}
            icon={<ZoomInOutlined />}
          ></Button>
          <Button
            id={"transgraph-zoomOut"}
            size={"medium"}
            shape={"circle"}
            icon={<ZoomOutOutlined />}
          ></Button>
          <Button
            title={"Clear selection"}
            shape={"circle"}
            id={"transgraph-clearSelection"}
            size={"medium"}
            icon={<ClearOutlined />}
            onClick={clearSelectedDataHandler}
          ></Button>
        </div>
        <svg id="transmission-svg" ref={transmissionSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default TransGraph;
