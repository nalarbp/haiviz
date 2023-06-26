/* ============================================================================
Gantt chart :
- when dataset for chart is available, render temporal barchart viewer
let viwer_data_dummy = [
  { id: val, start_date: "2020-01-1", end_date: "2020-01-1", locationType: Ward, location_name: W1},
  {...}]
============================================================================ */
import React, { useState, useEffect, useRef } from "react";
import { select } from "d3-selection";
import { line, curveNatural } from "d3-shape";
import { Empty } from "antd";
import {
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceLink,
  forceCollide,
  forceRadial,
} from "d3-force";
import { filterUnique, getColorScaleByObject } from "../utils/utils";

import Moment from "moment";
import { extendMoment } from "moment-range";

const _ = require("lodash");

const PatientMovement = (props) => {
  //INTERNAL STATES/REFS
  const ganttChartSVGRef = useRef();
  const ganttChartContainerRef = useRef();
  const [selectedLocation] = useState(null);

  //DRAWING CONSTRUCTOR
  const svg = select(ganttChartSVGRef.current);
  const observedWidth = props.width - 10; //observedWidth
  const observedHeight = props.height - 80; // observedHeight
  const margin = { top: 10, right: 20, bottom: 40, left: 60 };
  const ganttChart_w = observedWidth - margin.left - margin.right;
  const ganttChart_h = observedHeight - margin.top - margin.bottom - 10;
  const curve = line().curve(curveNatural);
  const arrowHeadPath = line();

  //SETTINGS
  const isUserStartResize = props.movementSettings.isUserStartResize;
  const nodeSize = props.movementSettings.nodeSize;
  const isLineShown = props.movementSettings.isOverlappingLineShown;
  const isLineScaled = props.movementSettings.isOverlappingLineScaled;
  const lineScaleFactor = props.movementSettings.overlappingLineScaleFactor;

  //USE EFFECTS
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
    } else {
      select("#ganttChart-svgGroup").remove();
      select("#movement-buttons-container").style("display", "none");
      select("#movement-no-drawing").style("display", "block");
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
      svg.selectAll(".gantt-chart-rectangle").attr("fill", (d) => {
        let col = props.colorScale.byLocation.get(d.location_name);
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
      svg.selectAll(".gantt-colDate-marker").attr("fill", (d) => {
        return getColorScaleByObject(d, props.colorScale);
      });
    }
  }, [props.colorScale]);

  useEffect(() => {
    if (selectedLocation && isLineShown) {
      //console.log(selectedLocation);
      svg.selectAll(".gantt-overlapping-path").style("opacity", (d) => {
        //console.log(d.source.location_name, selectedLocation);
        if (d.source.location_name === selectedLocation) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (!selectedLocation && isLineShown) {
      svg.selectAll(".gantt-overlapping-path").style("opacity", 1);
    } else {
      svg.selectAll(".gantt-overlapping-path").style("opacity", 0);
    }
  }, [selectedLocation, isLineShown]);

  useEffect(() => {
    if (isLineScaled && lineScaleFactor) {
      svg
        .selectAll(".gantt-overlapping-path")
        .attr("stroke-width", (d) => lineScaleFactor * d.overlapDay);
    } else {
      svg.selectAll(".gantt-overlapping-path").attr("stroke-width", 1);
    }
  }, [isLineScaled, lineScaleFactor]);

  //DRAWING
  function draw() {
    //CLEANING UP
    select("#movement-no-drawing").style("display", "none");
    select("#ganttChart-svgGroup").remove();

    //DATA PREPS
    const chartData = props.data;
    const chartData_locMap = new Map();
    chartData.map((d) => {
      chartData_locMap.set(d.location_name, d);
    });

    const hostList = props.data.map((d) => d.source_name).filter(filterUnique);
    //get the locationList
    let locationList = props.data
      .map((d) => d.location_name)
      .filter(filterUnique);
    //locationList.push("start", "end");

    let nodes = [];
    locationList.forEach((location, i) => {
      nodes.push({
        index: i,
        id: location,
      });
    });

    let links = [];
    hostList.forEach((host) => {
      //console.log(host);
      let host_movement_data = _.cloneDeep(chartData)
        .filter((d) => d.source_name === host)
        .sort((a, b) =>
          a.start_date > b.start_date ? 1 : b.start_date > a.start_date ? -1 : 0
        );
      //console.log(host_movement_data);
      //console.log(host_movement_data.length);
      for (var i = 0; i < host_movement_data.length; i++) {
        if (i !== host_movement_data.length - 1) {
          let record = host_movement_data[i];
          let record_next = host_movement_data[i + 1];
          let movement = {
            hostID: record.source_name,
            source: record.location_name,
            target: record_next.location_name,
            dateOutFromSource: record.end_date,
            dateIntoTarget: record_next.start_date,
          };
          //console.log(movement);
          links.push(movement);
        }
        // if (i === 0) {
        //   let movement_start = {
        //     hostID: record.source_name,
        //     source: "start",
        //     target: record.location_name,
        //     dateOutFromSource: record.start_date,
        //     dateIntoTarget: record.start_date
        //   };
        //   links.push(movement_start);
        // } else if (i === host_movement_data.length - 1) {
        //   let movement_end = {
        //     hostID: record.source_name,
        //     source: record.location_name,
        //     target: "end",
        //     dateOutFromSource: record.end_date,
        //     dateIntoTarget: record.end_date
        //   };
        //   links.push(movement_end);
        // } else {

        // }
      }
      //console.log("===");
    });

    //create network object: {node : [{node1}, {node2}], links: [{link1}, {link2}]}
    const network_data = { nodes: nodes, links: links };
    //console.log(network_data);

    //draw at svg
    const svg = select(ganttChartSVGRef.current);
    svg
      .attr("width", ganttChart_w + margin.left + margin.right)
      .attr("height", ganttChart_h + margin.top + margin.bottom);

    //make group root of svg for transformation purpose
    let svgGroup = svg
      .append("g")
      .attr("id", "ganttChart-svgGroup")
      .attr("transform", "translate(" + margin.left + "," + 5 + ")");

    //draw network
    forceSimulation(network_data.nodes)
      .force(
        "center",
        forceCenter()
          .x(ganttChart_w / 2)
          .y(ganttChart_h / 2)
      )
      .force("charge", forceManyBody().strength(-25))
      .force("collide", forceCollide().strength(-1))
      .force(
        "link",
        forceLink()
          .id((d) => d.id)
          .links(network_data.links)
      )
      .force(
        "radial",
        forceRadial()
          .radius(ganttChart_h / 4)
          .x(ganttChart_w / 2)
          .y(ganttChart_h / 2)
      )
      .tick(30)
      .stop();

    //console.log(network_data.links);

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

    //make links line
    linksGroup
      .selectAll(".trans_link")
      .data(network_data.links)
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
      .attr("stroke", (d) => {
        if (d.hostID === "P12") {
          return "red";
        } else {
          return "black";
        }
      })
      .attr("stroke-width", 1)
      .style("fill", "none")
      .style("opacity", 1)
      .attr("marker-mid", "url(#trans_arrow_black)");

    //make nodes group and draw nodes on it
    let nodesGroup = svgGroup.append("g").attr("id", "nodesGroup");
    //draw node circle
    nodesGroup
      .selectAll(".trans_nodeCircle")
      .data(network_data.nodes)
      .enter()
      .append("circle")
      .attr("class", "trans_nodeCircle")
      .attr("r", nodeSize)
      .attr("stroke", "black")
      .attr("fill", (d) => {
        let obj = chartData_locMap.get(d.id);
        let col = obj && obj.location_color ? obj.location_color : "black";
        return col;
      })
      .attr("stroke-width", "1px")
      .style("cursor", "move")
      .style("opacity", "0.9")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .append("title")
      .text((d) => d.id);

    // draw label
    nodesGroup
      .selectAll(".trans_nodeLabel")
      .data(network_data.nodes)
      .enter()
      .append("text")
      .attr("class", "trans_nodeLabel")
      .attr("x", (d) => d.x + 10)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "start")
      .attr("font-size", () => 10)
      .attr("fill", "black")
      .text((d) => d.id);

    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    }
  }
  function updateBySelectedData() {}
  function clearSelectedData() {}
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

  //console.log(selectedLocation);
  return (
    <React.Fragment>
      <div id="ganttChartContainer" ref={ganttChartContainerRef}>
        <div id="movement-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <svg id="ganttChart-svg" ref={ganttChartSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default PatientMovement;

/*
 */
