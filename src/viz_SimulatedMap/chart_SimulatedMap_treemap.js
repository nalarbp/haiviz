import React, { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
import { group } from "d3-array";
import { Empty, Button } from "antd";
import { treemap } from "d3-hierarchy";
import {
  getColorScaleByObject,
  getColumnNameByColorType,
} from "../utils/utils";
import "./style_simulatedMap.css";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { event as currentEvent } from "d3";
import { zoom } from "d3-zoom";
import { forceSimulation, forceManyBody, forceCollide } from "d3-force";
import usePrevious from "../react_hooks/usePrevious-hook";

const _ = require("lodash");

const SimulatedMapChart = (props) => {
  //INTERNAL STATES/REFS
  const zoomStateRef = useRef(null);

  //DRAWING CONSTRUCTOR
  const simulatedmapSVGRef = useRef();
  const simulatedmapContainerRef = useRef();
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 90;
  const container = select(simulatedmapContainerRef.current);
  const svg = select(simulatedmapSVGRef.current);
  const margin = { top: 10, right: 20, bottom: 10, left: 20 };
  const container_w = observedWidth;
  const container_h = observedHeight;
  const simulatedmap_width = container_w - margin.left - margin.right;
  const simulatedmap_height = container_h - margin.top - margin.bottom;
  const isolateDataClone = _.cloneDeep(Array.from(props.data.values()));
  const prevDimension = usePrevious(observedWidth + observedHeight);
  const isInitialDraw = prevDimension && prevDimension < 0 ? true : false;

  //DRAWING DATA PREP/
  //
  //SETTINGS
  const isUserStartResize = props.simulatedmapSettings.isUserStartResize_simap;
  const nodeSize = props.simulatedmapSettings.nodeSize;
  const textSize = props.simulatedmapSettings.textSize;
  const isLocationLabelShown = props.simulatedmapSettings.isLocationLabelShown;
  const layout = props.simulatedmapSettings.layout;

  //USEEFFECTS
  useEffect(() => {
    //console.log(isUserStartResize, props.isUserRedraw);
    if (isUserStartResize) {
      select("#simulatedmap_svgGroup").remove();
      select("#simulatedmap-buttons-container").style("display", "none");
      select("#simulatedmap-no-drawing").style("display", "block");
    } else {
      if (isInitialDraw) {
        draw();
      } else {
        if (props.isUserRedraw) {
          draw();
        }
      }
    }
    // if (
    //   observedWidth &&
    //   observedHeight &&
    //   !isUserStartResize &&
    //   !props.isUserRedraw
    // ) {
    //   draw(); //when initial draw
    // } else if (
    //   observedWidth &&
    //   observedHeight &&
    //   !isUserStartResize &&
    //   props.isUserRedraw
    // ) {
    //   draw(); //when user click redraw
    // } else {
    //   //console.log("hide and remove");
    //   select("#simulatedmap_svgGroup").remove();
    //   select("#simulatedmap-buttons-container").style("display", "none");
    //   select("#simulatedmap-no-drawing").style("display", "block");
    // }
  }, [isInitialDraw, isUserStartResize, props.isUserRedraw]);

  // === SELECTED DATA ===
  useEffect(() => {
    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    } else if (props.selectedData && props.selectedData.length === 0) {
      clearSelectedData();
    }
  }, [props.selectedData]);

  // === COLORSCALE ===
  useEffect(() => {
    if (props.colorScale.colorType) {
      if (layout === "scatter") {
        svg
          .selectAll(".simulatedMap_circles")
          .attr("fill", (d) => getColorScaleByObject(d, props.colorScale));
      } else if (layout === "piechart") {
        draw();
      }
    }
  }, [props.colorScale]);

  // === NODE SIZE ===
  useEffect(() => {
    if (nodeSize) {
      if (layout === "scatter") {
        if (props.selectedData && props.selectedData.length > 0) {
          svg.selectAll(".simulatedMap_circles").attr("r", nodeSize);
          updateBySelectedData();
        } else {
          svg.selectAll(".simulatedMap_circles").attr("r", nodeSize);
        }
      } else {
        draw();
      }
    }
  }, [nodeSize]);
  // === SHOW TEXT AND TEXT SIZE ===
  useEffect(() => {
    if (isLocationLabelShown && textSize) {
      svg
        .selectAll(".simap_tileLabel")
        .attr("display", "block")
        .attr("font-size", textSize + "pt");
    } else if (!isLocationLabelShown) {
      svg.selectAll(".simap_tileLabel").attr("display", "none");
    }
  }, [textSize, isLocationLabelShown]);
  // === LAYOUT ===
  useEffect(() => {
    if (layout) {
      draw();
    }
  }, [layout]);

  //DRAWING
  function draw() {
    const svg = select(simulatedmapSVGRef.current);
    //clean previous drawing artifacts
    select("#simulatedmap_svgGroup").remove();
    select("#simulatedmap-buttons-container").style("display", "block");
    select("#simulatedmap-no-drawing").style("display", "none");

    //set svg attributes
    svg
      .attr("width", simulatedmap_width + margin.left + margin.right)
      .attr("height", simulatedmap_height + margin.top + margin.bottom);

    //make group root of svg for transformation purpose
    let svgGroup = svg
      .append("g")
      .attr("id", "simulatedmap_svgGroup")
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
          return "translate(" + margin.left + "," + margin.top + ")scale(1)";
        }
      });

    //add treemap
    const treemapLayout = treemap()
      .size([simulatedmap_width, simulatedmap_height])
      .padding(4);
    const treeMap = treemapLayout(props.simulatedMap);
    //build Map table
    const locCoordMap = new Map();
    treeMap.leaves().forEach(function(d) {
      let key = d.data[0];
      let val = {
        box_w: Math.abs(d.x0 - d.x1),
        box_h: Math.abs(d.y0 - d.y1),
        locX: d.x0 + Math.abs(d.x0 - d.x1) / 2,
        locY: d.y0 + Math.abs(d.y0 - d.y1) / 2,
      };
      locCoordMap.set(key, val);
    });
    //add coord to isolateData clone
    isolateDataClone.forEach((d) => {
      let coord = locCoordMap.get(d.isolate_colLocation);
      d["x"] = coord.locX;
      d["y"] = coord.locY;
    });

    //draw tile of map
    svgGroup
      .append("g")
      .selectAll("rect")
      .data(treeMap.leaves())
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("stroke", "black")
      .style("fill", "white")
      .on("click", (d) => {
        let obj = isolateDataClone.filter(
          (el) => el.isolate_colLocation === d.data[0]
        );
        if (obj) {
          let selectedNames = obj.map((d) => d.uid);
          props.setSelectedData(selectedNames);
        }
      })
      .append("title")
      .text((d) => `${d.data[0]}: ${d.data[1]} isolates`);

    //add tile labels
    svgGroup
      .append("g")
      .selectAll(".simap_tileLabel")
      .data(treeMap.leaves())
      .enter()
      .append("text")
      .attr("class", "simap_tileLabel")
      .attr("x", (d) => d.x0 + 2)
      .attr("y", (d) => d.y0 + 15)
      .text((d) => d.data[0])
      .attr("font-size", textSize + "pt")
      .attr("display", (d) => (isLocationLabelShown ? "block" : "none"))
      .attr("fill", "black");

    //LAYOUT: SCATTER
    if (layout === "scatter") {
      //add simulation to avoid overlap
      forceSimulation(isolateDataClone) // create simulation for circles
        .force("gravity", forceManyBody().strength(-0.1))
        .force(
          "collide",
          forceCollide()
            .radius(nodeSize)
            .strength(0.3)
        )
        .tick(50)
        .stop();

      //draw circles of isolates
      svgGroup
        .append("g")
        .selectAll(".simulatedMap_circles")
        .data(isolateDataClone)
        .enter()
        .append("circle")
        .attr("class", "simulatedMap_circles")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", (d) => getColorScaleByObject(d, props.colorScale))
        .attr("r", nodeSize)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .style("cursor", "pointer")
        .style("opacity", 0.8)
        .on("click", (d) => {
          props.setSelectedData([d.uid]);
        })
        .append("title")
        .text((d) => `isolate: ${d.isolate_name}`);
    }
    //LAYOUT: PIE CHART
    else {
      const pieGenerator = pie()
        .sort(null)
        .value((d) => d[1].length);
      const isolateDataGroupByLoc = group(
        isolateDataClone,
        (d) => d.isolate_colLocation
      );
      //make data input for pie chart
      const locPieChartData = Array.from(locCoordMap.entries());
      //locPieChartData = [0:[0:loc_name, 1:{locX: loc, locY: loc, data: dataByLocGroup}]]
      locPieChartData.forEach((loc) => {
        let data = isolateDataGroupByLoc.get(loc[0]);
        if (Array.isArray(data)) {
          data = Array.from(
            group(data, (d) =>
              getColumnNameByColorType(d, props.colorScale.colorType)
            ).entries()
          );
        }
        loc[1]["data"] = data;
        //console.log(loc);
      });

      // 1. list of locations, with each location has data
      // 2. this data is feed to pieGenetor
      // make nodes group and draw nodes on it
      let nodesGroup = svgGroup.append("g").attr("id", "simap_nodesGroup");
      //draw node circle
      let pieGroup = nodesGroup
        .selectAll(".simap_pieGroup")
        .data(locPieChartData)
        .enter()
        .append("g")
        .attr("class", "simap_pieGroup")
        .attr(
          "transform",
          (d) => "translate(" + d[1].locX + "," + d[1].locY + ")"
        );
      let pieArcGroup = pieGroup
        .selectAll(".simap_pieArcGroup")
        .data((d) => {
          let res = d[1].data ? pieGenerator(d[1].data) : [null];
          return res;
        })
        .enter()
        .append("g")
        .attr("class", "simap_pieArcGroup");

      pieArcGroup
        .append("path")
        .attr("d", (d) => {
          if (d) {
            let arcGenerator = arc()
              .outerRadius(nodeSize)
              .innerRadius(0);
            return arcGenerator(d);
          } else {
            return "none";
          }
        })
        .style("fill", (d) => {
          if (d) {
            let obj = d.data[1][0] ? d.data[1][0] : null;
            let col = obj
              ? getColorScaleByObject(obj, props.colorScale)
              : "black";
            return col;
          } else {
            return "black";
          }
        })
        .style("opacity", 1)
        .on("click", (d) => {
          let clickedData = d.data[1];
          let clickedselectedData = [];
          if (clickedData.length > 0) {
            clickedData.forEach((d) => {
              clickedselectedData.push(d.uid);
            });
          }
          props.setSelectedData(clickedselectedData);
        })
        .append("title")
        .text((d) => {
          if (d) {
            let percentage = (
              ((d.endAngle - d.startAngle) / (2 * Math.PI)) *
              100
            ).toFixed(2);
            return d.data[0] + " " + percentage + "%";
          } else {
            return "none";
          }
        });
    }

    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    }

    //zoom functionality
    const zoomHandler = zoom()
      .scaleExtent([0.1, 6])
      .on("zoom", () => {
        zoomStateRef.current = currentEvent.transform;
        select("#simulatedmap_svgGroup").attr(
          "transform",
          currentEvent.transform
        );
      })
      .filter(function() {
        return !currentEvent.button && currentEvent.type !== "wheel";
      });

    //Zoom in button
    container.select("#simulatedmap-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });
    //Zoom out button
    container.select("#simulatedmap-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.5);
    });

    svg.call(zoomHandler);
  }

  function updateBySelectedData() {
    if (layout === "scatter") {
      svg
        .selectAll(".simulatedMap_circles")
        .attr("r", (d) => {
          if (props.selectedData.indexOf(d.uid) !== -1) {
            return nodeSize * 1.5;
          } else {
            return nodeSize;
          }
        })
        .style("opacity", (d) => {
          if (props.selectedData.indexOf(d.uid) !== -1) {
            return 0.8;
          } else {
            return 0.2;
          }
        });
    } else {
      svg.selectAll(".simap_pieArcGroup").style("opacity", (d) => {
        //get all isolates from the slice of the pie chart
        let isolatesInSlice = d.data[1].map((d) => d.isolate_name);
        let diff = isolatesInSlice.filter(function(n) {
          return props.selectedData.indexOf(n) !== -1;
        });
        //if it contains isolate_name that in selected data list, show it
        if (diff && diff.length > 0) {
          return 0.8;
        } else {
          return 0.2;
        }
      });
    }
  }

  function clearSelectedData() {
    if (layout === "scatter") {
      svg
        .selectAll(".simulatedMap_circles")
        .attr("r", (d) => nodeSize)
        .style("opacity", (d) => 0.8);
    } else {
      svg.selectAll(".simap_pieArcGroup").style("opacity", 1);
    }
  }

  //HANDLERS
  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };

  return (
    <React.Fragment>
      <div
        style={{ height: "100%" }}
        id="simulatedmapContainer"
        ref={simulatedmapContainerRef}
      >
        <div id="simulatedmap-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="simulatedmap-buttons-container">
          <div id="simulatedmap-zoom-buttons">
            <Button
              title={"Zoom in"}
              shape={"circle"}
              id={"simulatedmap-zoomIn"}
              size={"medium"}
              icon={<ZoomInOutlined />}
            ></Button>
            <Button
              title={"Zoom out"}
              shape={"circle"}
              id={"simulatedmap-zoomOut"}
              size={"medium"}
              icon={<ZoomOutOutlined />}
            ></Button>
            <Button
              title={"Clear selection"}
              shape={"circle"}
              id={"simulatedmap-clearSelection"}
              size={"medium"}
              icon={<ClearOutlined />}
              onClick={clearSelectedDataHandler}
            ></Button>
          </div>
        </div>
        <svg id="simulatedmap-svg" ref={simulatedmapSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default SimulatedMapChart;
