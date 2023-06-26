/* ============================================================================
============================================================================ */
import React, { useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { select } from "d3-selection";
import { Col, Button, Input } from "antd";
import { zoom } from "d3-zoom";
import { drag } from "d3-drag";
import { v1 as uuidv1 } from "uuid";
import { event as currentEvent } from "d3";
import "./style_CreateMap.css";
import withMeasure from "../hocs/withMeasure";
import buildHAIvizXML from "../utils/buildXML";
import { downloadFileAsText } from "../utils/utils";
import {
  DownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PlusCircleOutlined,
  CompassOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const dimensions = ["width", "height"];

//props.svgMap props.height, props.width, props.locationData, props.setlocationData
const MapEditorChart = (props) => {
  //NAV states
  const history = useHistory();
  const navToHAIvizAppHandler = useCallback(() => history.push("/haiviz-spa"), [
    history,
  ]);
  //INTERNAL STATES
  const initalLocationData = props.locationData ? props.locationData : [];

  //DATA PREP
  const locationDataRef = useRef(initalLocationData);
  const activeLocationRef = useRef(null);
  const tableData = useRef(null);

  //DRAWING CONSTRUCTOR
  const mapeditorSVGRef = useRef();
  const mapeditorContainerRef = useRef();
  const mapeditorTableContainerRef = useRef();

  const observedWidth = props.width ? props.width - 10 : null; //arbitary width so that cause negative
  const observedHeight = props.height ? props.height - 80 : null;
  const container = select(mapeditorContainerRef.current);
  const tableContainer = select(mapeditorTableContainerRef.current);

  const svg = select(mapeditorSVGRef.current);
  const externalSVGnode = props.svgMap.cloneNode(true);
  externalSVGnode.setAttribute("id", "externalSVG");
  const container_w = observedWidth;
  const container_h = observedHeight;

  //USE EFFECTS
  useEffect(() => {
    if (props.locationData && initalLocationData) {
      if (locationDataRef.current.length === 0) {
        locationDataRef.current = props.locationData;
        draw();
      }
      draw();
    }
  }, [props.locationData, initalLocationData]);
  useEffect(() => {
    if (observedWidth && observedHeight && props.svgMap) {
      draw();
    }
  }, [observedWidth, observedHeight, props.svgMap]);

  //DRAWING
  function draw() {
    const svg = select(mapeditorSVGRef.current);
    svg.attr("width", container_w).attr("height", container_h);
    let svgBaseGroup = svg.select("#mapeditor-base-g");
    let baseMapCount = svgBaseGroup.node().childElementCount;
    if (baseMapCount !== 0) {
      let child = svgBaseGroup.node().firstChild;
      svgBaseGroup.node().removeChild(child);
      svgBaseGroup.node().appendChild(externalSVGnode);
    } else {
      svgBaseGroup.node().appendChild(externalSVGnode);
    }

    //Draw initial location marker
    let markerBaseGroup = svg.select("#location-marker-g");
    updateLocationMarker();

    //Draw initial table location
    updateTable();

    // == ADDING NEW LOCATION ==
    // Button
    container.select("#map-editor-addLocation").on("click", () => {
      const uniqueid = uuidv1();
      const newLocation = {
        id: uniqueid,
        x: 200,
        y: 240,
        active: false,
        name: "Location-name",
      };
      const isDuplicatedRecords = locationDataRef.current.find(
        (d) => d.name === newLocation.name
      )
        ? true
        : false;
      if (!isDuplicatedRecords) {
        locationDataRef.current.push(newLocation);
        updateLocationMarker();
        updateTable();
      } else {
        alert(
          "Location with name " +
            newLocation.name +
            " is exist. Please update the name first"
        );
      }
    });

    // == REMOVING NEW LOCATION ==
    // Button
    container.select("#map-editor-removeLocation").on("click", () => {
      if (activeLocationRef.current) {
        let filteredLocation = locationDataRef.current.filter(
          (d) => activeLocationRef.current.id !== d.id
        );
        locationDataRef.current = filteredLocation;
        updateLocationMarker();
        updateTable();
      }
    });

    function clickedMarkerHandler(d) {
      markerBaseGroup.selectAll(".map-editor-markers").attr("fill", "blue");
      select(this).attr("fill", "red");
      let activeLocClone = Object.assign({}, d);
      activeLocationRef.current = activeLocClone;
      updateTable();
    }

    function dragged(d) {
      select(this)
        .attr("cx", (d.x = currentEvent.x))
        .attr("cy", (d.y = currentEvent.y));
    }

    function dragended(d) {
      updateTable();
    }

    //UPDATE FUNCTIONS
    function updateLocationMarker() {
      markerBaseGroup.selectAll(".map-editor-markers").remove();
      //red-draw
      markerBaseGroup
        .selectAll(".map-editor-markers")
        .data(locationDataRef.current)
        .enter()
        .append("circle")
        .attr("class", "map-editor-markers")
        .attr("cx", (d) => {
          return d.x;
        })
        .attr("cy", (d) => {
          return d.y;
        })
        .attr("r", 10)
        .attr("fill", "blue")
        .style("opacity", "0.5")
        .on("click", clickedMarkerHandler)
        .call(
          drag()
            .on("drag", dragged)
            .on("end", dragended)
        );
    }
    function updateTable() {
      tableData.current = locationDataRef.current.map((d) => {
        return {
          id: d.id,
          name: d.name,
          x: Math.floor(d.x),
          y: Math.floor(d.y),
        };
      });
      tableContainer.select("#map-editor-table-viewer tbody").remove();
      let tableViewer_tr = tableContainer
        .select("#map-editor-table-viewer")
        .append("tbody")
        .selectAll("tr")
        .data(tableData.current)
        .enter()
        .append("tr");

      tableViewer_tr
        .selectAll("td")
        .data(function(d, i) {
          return [d.name, d.x, d.y];
        })
        .enter()
        .append("td")
        .style("background-color", function(d) {
          if (
            activeLocationRef.current &&
            activeLocationRef.current.name === d
          ) {
            return "pink";
          } else {
            return "white";
          }
        })
        .text(function(d) {
          return d;
        });
    }

    // AUXILARY FUNCTIONALITIES
    // == LOCATION NAME UPDATE ==
    container.select("#marker-update-button").on("click", () => {
      if (activeLocationRef.current) {
        let activeLocIdx = locationDataRef.current.findIndex(function(d) {
          return d.id === activeLocationRef.current.id;
        });
        let isDuplicatedRecords = locationDataRef.current.find(
          (d) => d.name === activeLocationRef.current.name
        )
          ? true
          : false;
        if (!isDuplicatedRecords) {
          locationDataRef.current[activeLocIdx].name =
            activeLocationRef.current.name;
          updateTable();
        } else {
          alert(
            "Location with name " +
              activeLocationRef.current.name +
              " is exist. Duplication is not allowed"
          );
        }
      }
    });
    // == ZOOM ==
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
    //Zoom in button
    container.select("#map-editor-zoomIn").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 1.5);
    });
    //Zoom out
    container.select("#map-editor-zoomOut").on("click", () => {
      zoomHandler.scaleBy(svg.transition().duration(500), 0.5);
    });

    // == MAP DOWNLOAD ==
    container.select("#download-map-button").on("click", () => {
      if (locationDataRef.current.length === 0) {
        alert("Location data is empty, please add one");
        return;
      }
      let svgMapClone = externalSVGnode.cloneNode(true);
      let haivizXML = buildHAIvizXML(svgMapClone, locationDataRef.current);

      downloadFileAsText("haivizMap.xml", haivizXML);
    });

    // == MAP UPLOAD TO HAIVIZ ==
    container.select("#load-map-button").on("click", () => {
      if (locationDataRef.current.length === 0) {
        alert("Location data is empty, please add one");
        return;
      }
      let svgMapClone = externalSVGnode.cloneNode(true);
      let haivizXML_str = buildHAIvizXML(svgMapClone, locationDataRef.current); // haivizXML is string
      let xmlParser = new DOMParser();
      let haivizXML = xmlParser.parseFromString(haivizXML_str, "text/xml");
      if (props.isolateData) {
        props.loadXML(haivizXML);
        navToHAIvizAppHandler();
        props.changeNavLocation("haivizApp");
      } else {
        alert(
          "No isolate metadata is loaded on HAIviz. Please load the metadata first"
        );
      }
    });

    svg.call(zoomHandler);
  }

  return (
    <React.Fragment>
      <Col id="map-editor-map" xs={24} lg={17}>
        <div id="map-editor-container" ref={mapeditorContainerRef}>
          <div id="marker-update-container">
            <Input
              id={"marker-update-input"}
              placeholder={
                activeLocationRef.current
                  ? activeLocationRef.current
                  : "Location name"
              }
              onChange={(e) => {
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
              Download final map
            </Button>

            <Button
              id={"load-map-button"}
              shape="round"
              icon={<UploadOutlined />}
              size={"medium"}
            >
              Load map to HAIviz
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
            <div>
              <Button
                title={"Remove location"}
                shape={"circle"}
                id={"map-editor-removeLocation"}
                size={"medium"}
                icon={<DeleteOutlined />}
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

const MapEditorChartContainer = (props) => {
  return (
    <React.Fragment>
      <MapEditorChart
        svgMap={props.svgMap}
        loadLocationData={props.loadLocationData}
        locationData={props.locationData}
        width={props.width}
        height={props.height}
        isolateData={props.isolateData}
        loadXML={props.loadXML}
        changeNavLocation={props.changeNavLocation}
      />
    </React.Fragment>
  );
};

const MeasuredMapEditorChartContainer = withMeasure(dimensions)(
  MapEditorChartContainer
);

export default MeasuredMapEditorChartContainer;

/*
<Button
  id={"load-map-button"}
  shape="round"
  icon={<DownloadOutlined />}
  size={"medium"}
>
  Load map to HAIviz
</Button>
*/
