/* ============================================================================

============================================================================ */
import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { Slider, Empty } from "antd";
import { Delaunay } from "d3-delaunay";
import { filterUnique, getColorByIsolateName } from "../utils/utils";
import "./style_simulatedMap.css";
import usePrevious from "../react_hooks/usePrevious-hook";
import { forceSimulation, forceCenter, forceManyBody } from "d3-force";

const SimulatedMapChart = (props) => {
  //INTERNAL STATES
  const [clusterGravity, setclusterGravity] = useState(0.01);
  const prevClusterGravity = usePrevious(clusterGravity); // usePrevious always tail to states

  //DRAWING CONSTRUCTOR
  const simulatedmapSVGRef = useRef();
  const simulatedmapContainerRef = useRef();
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 60;
  const svg = select(simulatedmapSVGRef.current);
  const margin = { top: 10, right: 20, bottom: 10, left: 20 };
  const defaultTickNumber = 50;
  const container_w = observedWidth;
  const container_h = observedHeight;
  const simulatedmap_width = container_w - margin.left - margin.right;
  const simulatedmap_height = container_h - margin.top - margin.bottom;
  const isolateDataClone = props.data.map((d) => d);

  //DRAWING DATA PREP
  const locations = props.data
    .map((d) => d.isolate_colLocation)
    .filter(filterUnique);
  const simulatedLoc = locations.map((d) => {
    //create random locations
    return {
      name: d,
      x: Math.random() * (simulatedmap_width - 250),
      y: Math.random() * (simulatedmap_height - 150),
    };
  });
  const force_sim_loc = forceSimulation(simulatedLoc) //create simulation for loc
    .force(
      "center",
      forceCenter(simulatedmap_width / 2, simulatedmap_height / 2)
    )
    .force("charge", forceManyBody().strength(-5))
    .stop();
  const force_sim_circle = forceSimulation(isolateDataClone) // create simulation for circles
    .force("charge", forceManyBody().strength(-0.1))
    .stop();

  //SETTINGS
  const isUserStartResize = props.simulatedmapSettings.isUserStartResize_simap;

  const nodeSize = 5;

  //SELECTED DATA
  const selectedData = props.selectedData;

  //USEEFFECTS
  useEffect(() => {
    //console.log(isUserStartResize, props.isUserRedraw);
    if (
      observedWidth &&
      observedHeight &&
      !isUserStartResize &&
      !props.isUserRedraw
    ) {
      draw(); //when initial draw
    } else if (
      observedWidth &&
      observedHeight &&
      !isUserStartResize &&
      props.isUserRedraw
    ) {
      draw(); //when user click redraw
    } else {
      //console.log("hide and remove");
      select("#simulatedmap_svgGroup").remove();
      select("#simulatedmap-buttons-container").style("display", "none");
      select("#simulatedmap-no-drawing").style("display", "block");
    }
  }, [observedWidth, observedHeight, isUserStartResize, props.isUserRedraw]);

  useEffect(() => {
    if (
      clusterGravity &&
      prevClusterGravity &&
      prevClusterGravity !== clusterGravity
    ) {
      const gravityValue =
        clusterGravity <= prevClusterGravity ? -clusterGravity : clusterGravity;
      let new_force_sim_circle = forceSimulation(isolateDataClone)
        .force("charge", forceManyBody().strength(-1 * gravityValue))
        .stop();
      //run simulation
      for (var i = 0; i < 20; i++) {
        new_force_sim_circle.tick();
      }
      //draw isolates
      svg
        .selectAll("circle")
        .data(isolateDataClone)
        .join("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", nodeSize);
    }
  }, [clusterGravity]);

  useEffect(() => {
    if (selectedData) {
      svg
        .selectAll(".simulatedmap_nodeCircle")
        .attr("r", (d) => {
          //console.log(selectedData.indexOf(d.data.name));
          if (selectedData.indexOf(d.isolate_name) !== -1) {
            return nodeSize * 2;
          } else {
            return nodeSize;
          }
        })
        .attr("stroke", (d) => {
          //console.log(selectedData.indexOf(d.data.name));
          if (selectedData.indexOf(d.isolate_name) !== -1) {
            return "black";
          } else {
            return "none";
          }
        })
        .style("opacity", (d) => {
          if (selectedData.indexOf(d.isolate_name) !== -1) {
            return 0.8;
          } else {
            return 0.1;
          }
        });
    }
  }, [selectedData]);

  useEffect(() => {
    if (props.colorScale.colorType) {
      svg.selectAll(".simulatedmap_nodeCircle").attr("fill", (d) => {
        return getColorByIsolateName(
          d.isolate_name,
          props.colorScale,
          props.data
        );
      });
    }
  }, [props.colorScale.colorType]);

  useEffect(() => {
    if (props.data) {
      draw();
    }
  }, [props.data]);
  //DRAWING
  function draw() {
    const svg = select(simulatedmapSVGRef.current);
    //clean previous drawing artifacts
    select("#simulatedmap_svgGroup").remove();
    select("#simulatedmap-buttons-container").style("display", "block");
    select("#simulatedmap-no-drawing").style("display", "none");

    //run simulation to locs
    for (var i = 0; i < defaultTickNumber; i++) {
      force_sim_loc.tick();
    }
    //Make voronoi
    let voronoi = Delaunay.from(
      simulatedLoc,
      (d) => d.x,
      (d) => d.y
    ).voronoi([0, 0, simulatedmap_width, simulatedmap_height]);

    // add coordinates to isolate data
    isolateDataClone.forEach((d) => {
      let loc_coord = simulatedLoc.find(
        (e) => e.name === d.isolate_colLocation
      );
      d["x"] = loc_coord.x;
      d["y"] = loc_coord.y;
    });

    //run simulation to circles
    for (var i = 0; i < 20; i++) {
      force_sim_circle.tick();
    }

    //set svg attributes
    svg
      .attr("width", simulatedmap_width + margin.left + margin.right)
      .attr("height", simulatedmap_height + margin.top + margin.bottom);

    //make group root of svg for transformation purpose
    let svgGroup = svg.append("g").attr("id", "simulatedmap_svgGroup");

    //make path of voronoi diagram
    let pathGroup = svgGroup.append("g").attr("id", "simulatedmap_pathGroup");
    //draw path on it

    //draw isolates
    let circleGroup = svgGroup
      .append("g")
      .attr("id", "simulatedmap_circleGroup");

    //make location marker group
    let markerGroup = svgGroup
      .append("g")
      .attr("id", "simulatedmap_markerGroup");
  }

  //HANDLERS
  const gravityChangeHandler = (val) => {
    setclusterGravity(val);
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
          <p>Cluster's gravity</p>
          <Slider
            id={"simulatedmap-change-gravity"}
            min={0.001}
            max={1}
            step={0.01}
            onChange={gravityChangeHandler}
            defaultValue={clusterGravity}
          ></Slider>
        </div>
        <div id="simulatedmap-tooltip"></div>
        <svg id="simulatedmap-svg" ref={simulatedmapSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default SimulatedMapChart;
