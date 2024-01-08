import React, { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
import { group } from "d3-array";
import { zoom } from "d3-zoom";
import { event as currentEvent } from "d3";
import { Button, Empty } from "antd";
import "./style_Localmap.css";
import {
  getColorScaleByObject,
  getColumnNameByColorType,
} from "../utils/utils";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { forceSimulation, forceCollide, forceManyBody } from "d3-force";

const _ = require("lodash");

//props.data ={xmlsvg, data} svgMap props.height, props.width, props.locationData, props.setlocationData
const LocalmapChart = (props) => {
  //INTERNAL STATES/REFS
  const zoomStateRef = useRef(null);
  const localmapSVGRef = useRef();
  const localmapContainerRef = useRef();

  //DRAWING CONSTRUCTOR
  const container = select(localmapContainerRef.current);
  const svg = select(localmapSVGRef.current);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const externalSVGnode = props.data.xmlSVG.cloneNode(true);
  externalSVGnode.setAttribute("id", "externalSVG");
  const container_w = observedWidth;
  const container_h = observedHeight;
  const isolateDataClone = props.isolateData
    ? _.cloneDeep(Array.from(props.isolateData.values()))
    : [];

  //SETTINGS
  const isUserStartResize = props.localmapSettings.isUserStartResize;
  const nodeSize = props.localmapSettings.nodeSize;
  const textSize = props.localmapSettings.textSize;
  const textOffset = props.localmapSettings.textOffset;
  const isLocTextShown = props.localmapSettings.isLocTextShown;
  const layout = props.localmapSettings.layout;

  //HELPER FUNCTIONS

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
      select("#localmap_svgGroup").remove();
      select("#localmap-buttons-container").style("display", "none");
      select("#localmap-no-drawing").style("display", "block");
    }
  }, [observedWidth, observedHeight, isUserStartResize, props.isUserRedraw]);
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
          .selectAll(".localmap-circle")
          .attr("fill", (d) => getColorScaleByObject(d, props.colorScale));
      } else {
        draw();
      }
    }
  }, [props.colorScale]);
  // === NODE SIZE ===
  useEffect(() => {
    if (nodeSize) {
      if (layout === "scatter") {
        if (props.selectedData && props.selectedData.length > 0) {
          svg.selectAll(".localmap-circle").attr("r", (d) => nodeSize);
          updateBySelectedData();
        } else {
          svg.selectAll(".localmap-circle").attr("r", (d) => nodeSize);
        }
      } else {
        draw();
      }
    }
  }, [nodeSize]);
  // === SHOW TEXT AND TEXT SIZE ===
  useEffect(() => {
    if (isLocTextShown && textSize) {
      svg
        .selectAll(".localmap-locationLabel")
        .attr("display", "block")
        .attr("font-size", (d) => textSize + "pt");
    } else if (!isLocTextShown) {
      svg.selectAll(".localmap-locationLabel").attr("display", "none");
    }
  }, [isLocTextShown, textSize]);
  // === SHOW TEXT AND TEXT OFFSETT ===
  useEffect(() => {
    if (isLocTextShown && textOffset) {
      svg
        .selectAll(".localmap-locationLabel")
        .attr("display", "block")
        .attr("transform", (d) => "translate(" + textOffset + "," + 0 + ")");
    } else if (!isLocTextShown) {
      svg.selectAll(".localmap-locationLabel").attr("display", "none");
    }
  }, [isLocTextShown, textOffset]);
  // === LAYOUT ===
  useEffect(() => {
    if (layout) {
      draw();
    }
  }, [layout]);

  //DRAWING
  function draw() {
    const svg = select(localmapSVGRef.current);
    //cleaning
    select("#localmap-no-drawing").style("display", "none");
    select("#localmap-buttons-container").style("display", "block");
    select("#localmap_svgGroup").remove();
    //svg attributes
    svg.attr("width", container_w).attr("height", container_h);
    //make svg group root
    let svgGroup = svg
      .append("g")
      .attr("id", "localmap_svgGroup")
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
          return `translate(${margin.left},${margin.top})scale(1)`;
        }
      });
    //"translate(" + margin.left + "," + margin.top + ")" + "scale(1)"
    //inject externalSVG and scale it
    let svgBaseGroup = svgGroup.append("g").attr("id", "localmap-base-g");
    svgBaseGroup.node().appendChild(externalSVGnode);
    if (props.isolateData) {
      //add location coordinates
      const locCoordMap = new Map();
      isolateDataClone.forEach((d) => {
        let key = d.isolate_colLocation;
        let loc_coord = props.data.locationTable.get(d.isolate_colLocation);
        if (loc_coord) {
          d["x"] = loc_coord.x;
          d["y"] = loc_coord.y;
        } else {
          d["x"] = 0;
          d["y"] = 0;
        }
        let val = {
          locX: d.x,
          locY: d.y,
        };
        locCoordMap.set(key, val);
      });

      let circlesGroup = svgGroup.append("g").attr("id", "localmap-circle-g");
      //draw location label
      circlesGroup
        .selectAll(".localmap-locationLabel")
        .data(Array.from(props.data.locationTable.values()))
        .enter()
        .append("text")
        .attr("class", "localmap-locationLabel")
        .attr("x", (d) => d.x + textOffset)
        .attr("y", (d) => d.y)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-size", textSize + "pt")
        .attr("fill", "black")
        .attr("display", (d) => (isLocTextShown ? "block" : "none"))
        .text((d) => d.name);
      // LAYOUT: SCATTER
      if (layout === "scatter") {
        // add simulation to it
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

        //draw circle
        circlesGroup
          .selectAll(".localmap-circle")
          .data(isolateDataClone)
          .enter()
          .append("circle")
          .attr("class", "localmap-circle")
          .attr("r", (d) => nodeSize)
          .attr("stroke", "black")
          .attr("stroke-width", "1px")
          .style("opacity", "1")
          .style("display", (d) => {
            let loc_coord = props.data.locationTable.get(d.isolate_colLocation);
            if (loc_coord) {
              return "block";
            } else {
              return "none";
            }
          })
          .attr("cursor", "pointer")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("fill", (d) => getColorScaleByObject(d, props.colorScale))
          .on("click", (d) => {
            props.setSelectedData([d.isolate_name]);
          })
          .append("title")
          .text((d) => `isolate: ${d.isolate_name}`);
      }
      // === LAYOUT: PIECHART ===
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
        let nodesGroup = svgGroup.append("g").attr("id", "localmap_nodesGroup");
        //draw node circle
        let pieGroup = nodesGroup
          .selectAll(".localmap_pieGroup")
          .data(locPieChartData)
          .enter()
          .append("g")
          .attr("class", "localmap_pieGroup")
          .attr("transform", (d) => {
            let scale = 1;
            if (d[1].data) {
              let total = 0;
              d[1].data.forEach((d) => {
                total += d[1].length;
              });
              scale = Math.sqrt(total) / 1;
            }
            return (
              "translate(" +
              d[1].locX +
              "," +
              d[1].locY +
              ")" +
              "scale(" +
              scale +
              ")"
            );
          })
          .style("display", (d) => {
            let loc_coord = props.data.locationTable.get(d[0]);
            if (loc_coord) {
              return "block";
            } else {
              return "none";
            }
          });

        let pieArcGroup = pieGroup
          .selectAll(".localmap_pieArcGroup")
          .data((d) => {
            let res = d[1].data ? pieGenerator(d[1].data) : [null];
            return res;
          })
          .enter()
          .append("g")
          .attr("class", "localmap_pieArcGroup");

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
          .style("opacity", (d) => 1)
          .on("click", (d) => {
            let clickedData = d.data[1];
            let clickedselectedData = [];
            if (clickedData.length > 0) {
              clickedData.forEach((d) => {
                clickedselectedData.push(d.isolate_name);
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
    }

    //zoom functionality
    const zoomHandler = zoom()
      .scaleExtent([0.1, 6])
      .on("zoom", () => {
        zoomStateRef.current = currentEvent.transform;
        select("#localmap_svgGroup").attr("transform", currentEvent.transform);
      })
      .filter(function() {
        return !currentEvent.button && currentEvent.type !== "wheel";
      });

    //Zoom in button
    container.select("#localmap-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });
    //Zoom out button
    container.select("#localmap-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.5);
    });

    svg.call(zoomHandler);
  }
  function updateBySelectedData() {
    if (layout === "scatter") {
      svg
        .selectAll(".localmap-circle")
        .attr("r", (d) => {
          //console.log(selectedData, d);
          if (props.selectedData.indexOf(d.isolate_name) !== -1) {
            return nodeSize * 1.5;
          } else {
            return nodeSize;
          }
        })
        .style("opacity", (d) => {
          if (props.selectedData.indexOf(d.isolate_name) !== -1) {
            return 0.9;
          } else {
            return 0.2;
          }
        });
    } else {
      svg.selectAll(".localmap_pieArcGroup").style("opacity", (d) => {
        let isolatesInSlice = d.data[1].map((d) => d.isolate_name);
        let diff = isolatesInSlice.filter(function(n) {
          return props.selectedData.indexOf(n) !== -1;
        });
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
        .selectAll(".localmap-circle")
        .attr("r", (d) => nodeSize)
        .style("opacity", (d) => 0.8);
    } else {
      svg.selectAll(".localmap_pieArcGroup").style("opacity", (d) => 1);
    }
  }
  //HANDLERS
  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };
  return (
    <React.Fragment>
      <div id="localmapContainer" ref={localmapContainerRef}>
        <div id="localmap-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="localmap-buttons-container">
          <div id="localmap-zoom-buttons">
            <Button
              title={"Zoom in"}
              shape={"circle"}
              id={"localmap-zoomIn"}
              size={"medium"}
              icon={<ZoomInOutlined />}
            ></Button>
            <Button
              title={"Zoom out"}
              shape={"circle"}
              id={"localmap-zoomOut"}
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
        <div id="localmap-tooltip"></div>
        <svg id="localmap-svg" ref={localmapSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default LocalmapChart;
