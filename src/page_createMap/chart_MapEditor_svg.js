import React, { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { Button, Input } from "antd";
import { zoom } from "d3-zoom";
import { drag } from "d3-drag";
import { v1 as uuidv1 } from "uuid";
import { event as currentEvent } from "d3";
import "./style_CreateMap.css";
import buildHAIvizXML from "../utils/buildXML";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadLocationsMapEditor } from "../action/mapEditor_actions";
import _ from "lodash";

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

const MapEditorChart = (props) => {
  //INTERNAL STATES
  const initalLocationData = props.mapEditorLocations
    ? props.mapEditorLocations
    : [];

  //DATA PREP
  const locationDataRef = useRef(initalLocationData);
  const activeLocationRef = useRef(null);

  //DRAWING CONSTRUCTOR
  const mapeditorSVGRef = useRef();
  const mapeditorContainerRef = useRef();
  const observedWidth = props.width ? props.width - 10 : null; //arbitary width so that cause negative
  const observedHeight = props.height ? props.height - 80 : null;
  const container = select(mapeditorContainerRef.current);
  const externalSVGnode = props.mapEditorSVG.cloneNode(true);
  //externalSVGnode.setAttribute("id", "externalSVG");
  const container_w = observedWidth;
  const container_h = observedHeight;

  //Initital drawing
  useEffect(() => {
    if (props.mapEditorSVG) {
      draw();
    }
  }, []);

  //USE EFFECTS
  useEffect(() => {
    if (props.mapEditorLocations && initalLocationData) {
      if (locationDataRef.current.length === 0) {
        locationDataRef.current = props.mapEditorLocations;
        draw();
      }
      draw();
    }
  }, [props.mapEditorLocations, initalLocationData]);

  useEffect(() => {
    if (observedWidth && observedHeight && props.mapEditorSVG) {
      draw();
    }
  }, [observedWidth, observedHeight, props.mapEditorSVG]);

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

    // BUTTON: Add new location
    container.select("#map-editor-addLocation").on("click", () => {
      const uniqueid = uuidv1();
      const newLocation = {
        id: uniqueid,
        x: 200 + Math.floor(Math.random() * 100),
        y: 240 + Math.floor(Math.random() * 100),
        active: false,
        name: "New-" + String(uniqueid),
      };
      //do all together: update locationDataRef.current, update Store, Update this workspace
      //locationDataRef.current.push(newLocation);
      locationDataRef.current.push(newLocation);
      //deep copy locationDataRef.current and assign to newLocations
      let newLocations = _.cloneDeep(locationDataRef.current);
      props.loadLocationsMapEditor(newLocations);
      updateLocationMarker();
    });

    // BUTTON: Remove location
    container.select("#map-editor-removeLocation").on("click", () => {
      if (activeLocationRef.current) {
        let filteredLocation = locationDataRef.current.filter(
          (d) => activeLocationRef.current.id !== d.id
        );
        locationDataRef.current = filteredLocation;
        props.loadLocationsMapEditor(locationDataRef.current);
        updateLocationMarker();
      }
    });

    // CALL: When click the circle
    function clickedMarkerHandler(d) {
      markerBaseGroup.selectAll(".map-editor-markers").attr("fill", "blue");
      select(this).attr("fill", "red");
      let activeLocClone = Object.assign({}, d);
      activeLocationRef.current = activeLocClone;
      //props.changeActiveLocationMapEditor(activeLocClone);
    }

    function dragstarted(d) {
      let activeLocClone = Object.assign({}, d);
      activeLocationRef.current = activeLocClone;
      markerBaseGroup.selectAll(".map-editor-markers").attr("fill", "blue");
      select(this).attr("fill", "red");
    }

    function dragging(d) {
      select(this)
        .attr("cx", (d.x = currentEvent.x))
        .attr("cy", (d.y = currentEvent.y));
    }

    function dragended(d) {
      let new_locationData = {
        x: Math.floor(currentEvent.x),
        y: Math.floor(currentEvent.y),
      };
      select(this)
        .attr("cx", (d.x = new_locationData.x))
        .attr("cy", (d.y = new_locationData.y));
      //update locationDataRef.current
      if (locationDataRef.current) {
        let activeLocIdx = locationDataRef.current.findIndex(function(d) {
          return d.id === activeLocationRef.current.id;
        });
        locationDataRef.current[activeLocIdx].x = new_locationData.x;
        locationDataRef.current[activeLocIdx].y = new_locationData.y;
        let newLocations = _.cloneDeep(locationDataRef.current);
        props.loadLocationsMapEditor(newLocations);
      }
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
        .attr("fill", (d) => {
          if (activeLocationRef.current) {
            if (d.id === activeLocationRef.current.id) {
              return "red";
            } else {
              return "blue";
            }
          } else {
            return "blue";
          }
        })
        .style("opacity", "0.5")
        .on("click", clickedMarkerHandler)
        .call(
          drag()
            .on("start", dragstarted)
            .on("drag", dragging)
            .on("end", dragended)
        )
        .append("title")
        .text((d) => d.name);
    }

    // INPUT: update location name
    container.select("#marker-update-button").on("click", () => {
      let inputVal = container.select("#marker-update-input").node().value;
      if (activeLocationRef.current) {
        activeLocationRef.current.name = inputVal;
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
          let newLocations = _.cloneDeep(locationDataRef.current);
          props.loadLocationsMapEditor(newLocations);
          updateLocationMarker();
        } else {
          alert(
            "Location with name " +
              activeLocationRef.current.name +
              " is exist. Duplication is not allowed"
          );
        }
      }
    });

    // == MAP DOWNLOAD ==
    container.select("#download-map-button").on("click", () => {
      if (locationDataRef.current.length === 0) {
        alert("Error: Minimum 1 location required.");
        return;
      }
      let svgMapClone = externalSVGnode.cloneNode(true);
      let haivizXML = buildHAIvizXML(svgMapClone, locationDataRef.current);

      downloadFileAsText("haivizMap.xml", haivizXML);
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

    svg.call(zoomHandler);
  }

  return (
    <React.Fragment>
      <div id="map-editor-container" ref={mapeditorContainerRef}>
        <div id="marker-update-container">
          <Input
            id={"marker-update-input"}
            placeholder="Location's name"
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
            Download Map
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
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    mapEditorSVG: state.mapEditor.svgData,
    mapEditorLocations: state.mapEditor.locationData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadLocationsMapEditor,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(MapEditorChart);
