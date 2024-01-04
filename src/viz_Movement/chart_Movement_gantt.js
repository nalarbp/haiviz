import React, { useState, useEffect, useRef } from "react";
import { extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { select } from "d3-selection";
import { scaleBand, scaleTime } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { line, curveNatural } from "d3-shape";
import { zoom } from "d3-zoom";
import { event as currentEvent } from "d3";
import { Empty, Button } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import {
  filterUnique,
  computeQuadraticCurve,
} from "../utils/utils";

import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const PatientMovement = (props) => {
  //INTERNAL STATES/REFS
  const zoomStateRef = useRef(null);
  const ganttChartSVGRef = useRef();
  const ganttChartContainerRef = useRef();
  const [selectedLocation, setselectedLocation] = useState(null);

  //DRAWING CONSTRUCTOR
  const container = select(ganttChartContainerRef.current);
  const svg = select(ganttChartSVGRef.current);
  const observedWidth = props.width - 10; //observedWidth
  const observedHeight = props.height - 80; // observedHeight
  const margin = { top: 10, right: 20, bottom: 40, left: 60 };
  const ganttChart_w = observedWidth - margin.left - margin.right;
  const ganttChart_h = observedHeight - margin.top - margin.bottom - 10;
  const curve = line().curve(curveNatural);

  //SETTINGS
  const isUserStartResize = props.movementSettings.isUserStartResize;
  const nodeSize = props.movementSettings.nodeSize / 2;
  const isLineShown = props.movementSettings.isOverlappingLineShown;
  const isLineScaled = props.movementSettings.isOverlappingLineScaled;
  const lineScaleFactor = props.movementSettings.overlappingLineScaleFactor;
  const isSortedBySuffix = props.movementSettings.isSortedBySuffix;
  const suffixSeparator = props.movementSettings.suffixSeparator;
  const doesUserResort = props.movementSettings.isResort;

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
      minimizeSVG();
    }
  }, [observedWidth, observedHeight, isUserStartResize, props.isUserRedraw]);
  useEffect(() => {
    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    } else if (props.selectedData && props.selectedData.length === 0) {
      clearSelectedData();
    }
  }, [props.selectedData]);
  // useEffect(() => {
  //   if (props.colorScale.colorType) {
  //     svg.selectAll(".gantt-chart-rectangle").attr("fill", (d) => {
  //       let col = 'gray'
  //       if (col) {
  //         return col;
  //       } else {
  //         if (d.location_color) {
  //           return d.location_color;
  //         } else {
  //           return "gray";
  //         }
  //       }
  //     });
  //     svg.selectAll(".gantt-colDate-marker").attr("fill", (d) => {
  //       return getColorScaleByObject(d, props.colorScale);
  //     });
  //   }
  // }, [props.colorScale]);

  useEffect(() => {
    if (selectedLocation && isLineShown) {
      //console.log(selectedLocation);
      svg.selectAll(".gantt-overlapping-path").style("display", (d) => {
        //console.log(d.source.location, selectedLocation);
        if (d.source.location === selectedLocation) {
          return "block";
        } else {
          return "none";
        }
      });
    } else if (!selectedLocation && isLineShown) {
      svg.selectAll(".gantt-overlapping-path").style("display", "block");
    } else {
      svg.selectAll(".gantt-overlapping-path").style("display", "none");
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

  useEffect(() => {
    draw();
  }, [doesUserResort]);

  //DRAWING
  function draw() {
    //CLEANING  UP
    select("#movement-no-drawing").style("display", "none");
    select("#movement-buttons-container").style("display", "block");
    select("#ganttChart-svgGroup").remove();

    //DATA PREPS
    const dateRange = extent(
      props.data.flatMap((d) => [d.start_date, d.end_date])
    );
    const dateRange_extra = [
      moment(dateRange[0]).subtract(1, "days"),
      moment(dateRange[1]).add(1, "days"),
    ];
    const hostList = props.data.map((d) => d.pid).filter(filterUnique);
    let separator = suffixSeparator;

    //sort hostlist
    if (isSortedBySuffix) {
      hostList.sort((a, b) => {
        let splitted_a = a.split(separator);
        let splitted_b = b.split(separator);

        let suffix_a = parseInt(splitted_a[splitted_a.length - 1])
          ? parseInt(splitted_a[splitted_a.length - 1])
          : splitted_a[splitted_a.length - 1];
        let suffix_b = parseInt(splitted_b[splitted_b.length - 1])
          ? parseInt(splitted_b[splitted_b.length - 1])
          : splitted_b[splitted_b.length - 1];

        if (suffix_a < suffix_b) {
          return true;
        } else {
          return false;
        }
      });
    }
    const locationList = props.data.map((d) => d.location).filter(filterUnique);
    const rectHeight = ganttChart_h / (hostList.length + 1);
    let overlapData = [];
    props.data.forEach((d, i) => {
      let sourceLoc = d;
      d.start_date.startOf("day");
      let sourceRange = moment.range(
        d.start_date.startOf("day"),
        d.end_date.endOf("day")
      );
      for (var j = i + 1; j < props.data.length; j++) {
        const targetLoc = props.data[j];
        if (
          sourceLoc.location === targetLoc.location &&
          sourceLoc.pid !== targetLoc.pid
        ) {
          let targetRange = moment.range(
            targetLoc.start_date.startOf("day"),
            targetLoc.end_date.endOf("day")
          );
          if (sourceRange.overlaps(targetRange)) {
            let overlapRange = sourceRange.intersect(targetRange);
            let overlapDur = overlapRange.diff("days");
            let fixed_overlapDur = overlapDur === 0 ? 1 : overlapDur;
            overlapData.push({
              source: sourceLoc,
              target: targetLoc,
              overlapDay: fixed_overlapDur,
            });
          }
        }
      }
    });

    //get subset of isolate data from location

    const svg = select(ganttChartSVGRef.current);
    svg
      .attr("width", ganttChart_w + margin.left + margin.right)
      .attr("height", ganttChart_h + margin.top + margin.bottom);

    //scale
    const scale_x = scaleTime()
      .domain(dateRange_extra)
      .range([0, ganttChart_w]);
    const scale_y = scaleBand()
      .domain(hostList)
      .range([0, ganttChart_h])
      .paddingInner(0.1)
      .paddingOuter(0.1);

    //axis
    const axis_x = axisBottom()
      .scale(scale_x)
      .tickSize([5])
      .tickFormat(timeFormat("%b-%d"));
    const axis_y = axisLeft()
      .scale(scale_y)
      .tickSize([5]);

    //make group root of svg for transformation purpose
    let svgGroup = svg
      .append("g")
      .attr("id", "ganttChart-svgGroup")
      .attr("transform", "translate(" + margin.left + "," + 5 + ")");

    //axis group
    svgGroup
      .append("g")
      .attr("transform", "translate(" + 0 + "," + ganttChart_h + ")")
      .call(axis_x);
    svgGroup.append("g").call(axis_y);

    //make background lane
    let backgroundLaneGroup = svgGroup
      .append("g")
      .attr("id", "gantt-backgroundLane-group");
    backgroundLaneGroup
      .selectAll(".gantt-backgroundLane")
      .data(hostList)
      .enter()
      .append("rect")
      .attr("class", "gantt-backgroundLane")
      .attr("stroke", "gray")
      .attr("stroke-width", "0.5px")
      .attr("fill", "none")
      .attr("x", () => scale_x(dateRange[0]))
      .attr("y", (d) => parseInt(scale_y(d)))
      .attr("width", () => scale_x(dateRange[1]) - scale_x(dateRange[0]))
      .attr("height", rectHeight)
      .style("opacity", 0.3);

    //make bar chart group and draw chart on it
    svgGroup
      .append("g")
      .attr("id", "barchartGroup")
      .selectAll(".gantt-chart-rectangle")
      .data(props.data)
      .enter()
      .append("rect")
      .attr("class", "gantt-chart-rectangle")
      .attr("height", (d) => {
        if (d.is_admDisc) {
          return rectHeight / 4;
        }
        return rectHeight;
      })
      .attr("stroke", "none")
      .attr("fill", (d) => {
        if (d.location_color) {
          return d.location_color;
        } else {
          return "gray";
        }
      })
      .attr("x", (d) => {
        return scale_x(d.start_date);
      })
      .attr("y", (d) => {
        if (d.is_admDisc) {
          return parseInt(scale_y(d.pid)) + rectHeight / 4 + rectHeight / 4 / 2;
        } else {
          return parseInt(scale_y(d.pid));
        }
      })
      .attr("width", (d) => {
        let diffRange = moment.range(d.start_date, d.end_date).diff("days");
        if (diffRange === 0) {
          return (
            scale_x(d.end_date.endOf("day")) -
            scale_x(d.start_date.startOf("day"))
          );
        } else {
          return scale_x(d.end_date) - scale_x(d.start_date);
        }
      })
      .on("click", (d) => {
        setselectedLocation(d.location);
      })
      .append("title")
      .text((d) => {
        let dateStart = moment(d.start_date).format("D-MMM-YYYY");
        let dateEnd = moment(d.end_date).format("D-MMM-YYYY");
        return d.location + ": " + dateStart + " to " + dateEnd;
      });

    //make path group
    let pathGroup = svgGroup.append("g").attr("id", "gantt-path-group");
    pathGroup
      .selectAll(".gantt-overlapping-path")
      .data(overlapData)
      .enter()
      .append("path")
      .attr("class", "gantt-overlapping-path")
      .attr("d", (d) => {
        let qPoint = computeQuadraticCurve(
          scale_x(d.source.start_date),
          parseInt(scale_y(d.source.pid) + rectHeight / 2),
          scale_x(d.target.start_date),
          parseInt(scale_y(d.target.pid) + rectHeight / 2),
          10
        );
        return curve([
          [
            scale_x(d.source.start_date),
            parseInt(scale_y(d.source.pid) + rectHeight / 2),
          ],
          qPoint,
          [
            scale_x(d.target.start_date),
            parseInt(scale_y(d.target.pid) + rectHeight / 2),
          ],
        ]);
      })
      .attr("fill", "none")
      .attr("cursor", "pointer")
      .attr("stroke-width", (d) =>
        isLineScaled ? lineScaleFactor * d.overlapDay : 1
      )
      .attr("stroke", "black")
      .style("display", (d) => {
        if (isLineShown) {
          if (selectedLocation) {
            if (d.source.location === selectedLocation) {
              return "block";
            } else {
              return "none";
            }
          } else {
            return "block";
          }
        } else {
          return "none";
        }
      })
      .append("title")
      .text((d) => {
        return (
          d.source.pid +
          "-" +
          d.target.pid +
          " at " +
          d.source.location +
          ": " +
          d.overlapDay +
          " days"
        );
      });
    //make isolate collection marker

    //if props.isolateData is not null and its data (d) contains pid
    //that is in hostList, then draw it
    if (props.isolateData) {
      let isolateData_loc = [];
      let has_pid_column = false;
      Array.from(props.isolateData.values()).forEach((d) => {
        //get records from isolate data and push it
        if (locationList.indexOf(d.isolate_colLocation) !== -1) {
          let isolateDate = moment(d.isolate_colDate);
          if (isolateDate.isBetween(dateRange_extra[0], dateRange_extra[1])) {
            isolateData_loc.push(d);
          }
        }
        if (d.pid && !has_pid_column) {
          has_pid_column = true;
        }
      });

      if (has_pid_column) {
        let colDateMarker = svgGroup
          .append("g")
          .attr("id", "gantt-colDate-group");
        colDateMarker
          .selectAll(".gantt-colDate-marker")
          .data(isolateData_loc)
          .enter()
          .append("circle")
          .attr("class", "gantt-colDate-marker")
          .attr("fill", "none")
          .attr("stroke", "black")
          .style("opacity", 0.9)
          .attr("stroke-width", "2px")
          .attr("r", nodeSize)
          .attr("cx", (d) => scale_x(d.isolate_colDate))
          .attr("cy", (d) => parseInt(scale_y(d.pid)) + rectHeight / 2)
          .on("click", (d) => props.setSelectedData([d.uid]))
          .style("cursor", "pointer")
          .append("title")
          .text((d) => `${d.isolate_name} from ${d.pid}`);
      }
    }

    svg.selectAll("#ganttChart-svgGroup g").attr("font-family", "Verdana");
    //zoom functionality

    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    }
    //zoom functionality
    const zoomHandler = zoom()
      .scaleExtent([0.1, 6])
      .on("zoom", () => {
        zoomStateRef.current = currentEvent.transform;
        select("#ganttChart-svgGroup").attr(
          "transform",
          currentEvent.transform
        );
      })
      .filter(function() {
        return !currentEvent.button && currentEvent.type !== "wheel";
      });

    //Zoom in button
    container.select("#movement-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });
    //Zoom out button
    container.select("#movement-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.5);
    });

    svg.call(zoomHandler);
  }
  function minimizeSVG() {
    const svg = select(ganttChartSVGRef.current);
    svg.attr("width", 0).attr("height", 0);
  }
  function updateBySelectedData() {
    svg
      .selectAll(".gantt-colDate-marker")
      .attr("r", (d) => {
        if (props.selectedData.indexOf(d.uid) !== -1) {
          return nodeSize * 1.5;
        } else {
          return nodeSize;
        }
      })
      .style("opacity", (d) => {
        if (props.selectedData.indexOf(d.uid) !== -1) {
          return 0.9;
        } else {
          return 0.2;
        }
      });
  }
  function clearSelectedData() {
    svg
      .selectAll(".gantt-colDate-marker")
      .attr("r", () => nodeSize)
      .style("opacity", () => 0.9);
  }

  //HELPER FUNCTIONS

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
        <div id="movement-buttons-container">
          <div id="movement-zoom-buttons">
            <Button
              title={"Zoom in"}
              shape={"circle"}
              id={"movement-zoomIn"}
              size={"medium"}
              icon={<ZoomInOutlined />}
            ></Button>
            <Button
              title={"Zoom out"}
              shape={"circle"}
              id={"movement-zoomOut"}
              size={"medium"}
              icon={<ZoomOutOutlined />}
            ></Button>
          </div>
        </div>
        <svg
          id="ganttChart-svg"
          className="ganttChart-svg_class"
          ref={ganttChartSVGRef}
        ></svg>
      </div>
    </React.Fragment>
  );
};

export default PatientMovement;

/*
 */
