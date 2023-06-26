/* ============================================================================
============================================================================ */
import React, { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { Col, Button, Input } from "antd";
import { zoom } from "d3-zoom";
import { drag } from "d3-drag";
import { v1 as uuidv1 } from "uuid";
import { event as currentEvent } from "d3";
import "./style_CreateMap.css";
import useResizeObserver from "../react_hooks/resizeObserver-hook";
import buildHAIvizXML from "../utils/buildXML";
import { downloadFileAsText } from "../utils/utils";
import {
  DownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PlusCircleOutlined,
  CompassOutlined
} from "@ant-design/icons";

//props.svgMap props.height, props.width, props.locationData, props.setlocationData
const MapEditorChart = props => {
  //INTERNAL STATES
  const initialLocationData = props.locationData ? props.locationData : [];

  //DATA PREP
  const locationDataRef = useRef(initialLocationData);
  const activeLocationRef = useRef(null);

  //DRAWING CONSTRUCTOR
  const mapeditorSVGRef = useRef();
  const mapeditorContainerRef = useRef();
  const mapeditorTableContainerRef = useRef();
  //console.log(mapeditorContainerRef);

  const container = select(mapeditorContainerRef.current);
  const tableContainer = select(mapeditorTableContainerRef.current);
  const dimensions = useResizeObserver(mapeditorContainerRef);

  //console.log("tableContainer", tableContainer);
  const observedWidth =
    dimensions && dimensions.width ? dimensions.width : null;
  const observedHeight =
    dimensions && dimensions.height ? dimensions.height : null;

  const svg = select(mapeditorSVGRef.current);
  const externalSVGnode = props.svgMap.cloneNode(true);
  externalSVGnode.setAttribute("id", "externalSVG");
  const container_w = observedWidth ? observedWidth : 0;
  const container_h = observedHeight ? observedHeight : 0;

  //USE EFFECTS
  useEffect(() => {
    if (props.locationData && initialLocationData) {
      draw();
    }
  }, [props.locationData, initialLocationData]);

  //when resize
  useEffect(() => {
    if (observedWidth && observedHeight && props.svgMap) {
      draw();
      //console.log(observedWidth);
      //console.log(prevDimensions);
    }
  }, [observedWidth, observedHeight, props.svgMap]);

  //DRAWING
  function draw() {
    console.log("draw");
    const svg = select(mapeditorSVGRef.current);
    //set svg att
    svg.attr("width", container_w).attr("height", container_h);
    //inject externalSVG and scale it
    let svgBaseGroup = svg.select("#mapeditor-base-g");
    //remove last base map child to avoid draw duplication
    let baseMapCount = svgBaseGroup.node().childElementCount;
    if (baseMapCount !== 0) {
      let child = svgBaseGroup.node().firstChild;
      svgBaseGroup.node().removeChild(child);
      svgBaseGroup.node().appendChild(externalSVGnode);
    } else {
      svgBaseGroup.node().appendChild(externalSVGnode);
    }

    //zoom functionality
    const zoomHandler = zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", () => {
        //select svg group root and transform using zoomstate
        select("#mapeditor-svg-gRoot").attr(
          "transform",
          currentEvent.transform
        );
      })
      .filter(function() {
        return !currentEvent.button && currentEvent.type !== "wheel";
      });

    //BUTTONS
    //Zoom in
    container.select("#map-editor-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });
    //Zoom out
    container.select("#map-editor-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.5);
    });
    //Download map
    container.select("#download-map-button").on("click", () => {
      if (locationDataRef.current.length === 0) {
        alert("Location data is empty, please add one");
        return;
      }
      let svgMapClone = externalSVGnode.cloneNode(true);
      let haivizXML = buildHAIvizXML(svgMapClone, locationDataRef.current);

      downloadFileAsText("haivizMap.xml", haivizXML);

      // build xml file and download it========================================
    });
    //console.log(props.locationData);
    //Update name
    container.select("#marker-update-button").on("click", () => {
      if (activeLocationRef.current) {
        // console.log(locationDataRef.current);
        // console.log(activeLocationRef.current);
        let activeLocIdx = locationDataRef.current.findIndex(function(d) {
          return d.id === activeLocationRef.current.id;
        });
        locationDataRef.current[activeLocIdx].name =
          activeLocationRef.current.name;

        //draw table
        let tableData = locationDataRef.current.map(d => {
          return { name: d.name, x: Math.floor(d.x), y: Math.floor(d.y) };
        });
        tableContainer.select("#map-editor-table-viewer tbody").remove();

        let tableViewer_tr = tableContainer
          .select("#map-editor-table-viewer")
          .append("tbody")
          .selectAll("tr")
          .data(tableData)
          .enter()
          .append("tr");

        tableViewer_tr
          .selectAll("td")
          .data(function(d, i) {
            return Object.values(d);
          })
          .enter()
          .append("td")
          .text(function(d) {
            return d;
          });
        // //end table
      }
    });

    //Add location
    let markerBaseGroup = svg.select("#location-marker-g");
    container.select("#map-editor-addLocation").on("click", () => {
      const uniqueid = uuidv1();
      const newLocation = {
        id: uniqueid,
        x: 200,
        y: 240,
        active: false,
        name: "Location-name"
      };
      locationDataRef.current.push(newLocation);
      //cleaning up
      markerBaseGroup.selectAll(".map-editor-markers").remove();
      //red-draw
      markerBaseGroup
        .selectAll(".map-editor-markers")
        .data(locationDataRef.current)
        .enter()
        .append("circle")
        .attr("class", "map-editor-markers")
        .attr("cx", d => {
          return d.x;
        })
        .attr("cy", d => {
          return d.y;
        })
        .attr("r", 10)
        .attr("fill", "blue")
        .style("opacity", "0.5")
        .on("click", clickedMarkerHandler)
        // .on("click", d => {
        //   activeLocationRef.current = d;
        //   select(this).attr("fill", "red");
        // })
        .call(
          drag()
            .on("drag", dragged)
            .on("end", dragended)
        );

      //draw table
      let tableData = locationDataRef.current.map(d => {
        return { name: d.name, x: d.x, y: d.y };
      });

      let tableViewer_tr = tableContainer
        .select("#map-editor-table-viewer tbody")
        .selectAll("tr")
        .data(tableData)
        .enter()
        .append("tr");

      tableViewer_tr
        .selectAll("td")
        .data(function(d, i) {
          return Object.values(d);
        })
        .enter()
        .append("td")
        .text(function(d) {
          return d;
        });
      //end table
    });

    function clickedMarkerHandler(d) {
      markerBaseGroup.selectAll(".map-editor-markers").attr("fill", "blue");

      select(this).attr("fill", "red");
      let activeLocClone = Object.assign({}, d);
      activeLocationRef.current = activeLocClone;
    }

    function dragged(d) {
      select(this)
        .attr("cx", (d.x = currentEvent.x))
        .attr("cy", (d.y = currentEvent.y));
      //console.log(currentEvent.x);
    }

    function dragended(d) {
      //update table
      //draw table
      let tableData = locationDataRef.current.map(d => {
        return { name: d.name, x: Math.floor(d.x), y: Math.floor(d.y) };
      });

      tableContainer.select("#map-editor-table-viewer tbody").remove();

      let tableViewer_tr = tableContainer
        .select("#map-editor-table-viewer")
        .append("tbody")
        .selectAll("tr")
        .data(tableData)
        .enter()
        .append("tr");

      tableViewer_tr
        .selectAll("td")
        .data(function(d, i) {
          return Object.values(d);
        })
        .enter()
        .append("td")
        .text(function(d) {
          return d;
        });
      //end table
    }

    svg.call(zoomHandler);
  }

  return (
    <React.Fragment>
      <Col id="map-editor-map" xs={24} lg={17}>
        <div
          id="map-editor-container"
          ref={mapeditorContainerRef}
          style={{ width: "100%" }}
        >
          <div id="marker-update-container">
            <Input
              id={"marker-update-input"}
              placeholder={"Location name"}
              onChange={e => {
                if (activeLocationRef.current) {
                  activeLocationRef.current.name = e.target.value;
                }
              }}
              prefix={<CompassOutlined />}
            />
            <Button
              block={true}
              id={"marker-update-button"}
              type="primary"
              size={"medium"}
            >
              Update location's name
            </Button>

            <Button
              id={"download-map-button"}
              type="danger"
              shape="round"
              icon={<DownloadOutlined />}
              size={"medium"}
            >
              Download final map!
            </Button>
          </div>
          <div id="map-editor-buttons-container">
            <div style={{ width: "35px", margin: "20px auto" }}>
              <Button
                title={"Zoom in"}
                shape={"circle"}
                id={"map-editor-zoomIn"}
                size={"medium"}
                icon={<ZoomInOutlined />}
              ></Button>
              <Button
                title={"Zoom out"}
                shape={"circle"}
                id={"map-editor-zoomOut"}
                size={"medium"}
                icon={<ZoomOutOutlined />}
              ></Button>
            </div>
            <div>
              <Button
                title={"Add location"}
                shape={"circle"}
                id={"map-editor-addLocation"}
                size={"medium"}
                icon={<PlusCircleOutlined />}
              ></Button>
            </div>
          </div>
          <svg id="mapeditor-svg" ref={mapeditorSVGRef}>
            <g id="mapeditor-svg-gRoot">
              <g id="mapeditor-base-g" />
              <g id="location-marker-g" />
            </g>
          </svg>
        </div>
      </Col>
      <Col id="map-editor-tables" xs={24} lg={7}>
        <div ref={mapeditorTableContainerRef}>
          <table id="map-editor-table-viewer">
            <thead>
              <tr>
                <th>Name</th>
                <th>x</th>
                <th>y</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default MapEditorChart;
