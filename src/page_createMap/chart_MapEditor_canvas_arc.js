/* ============================================================================
show base map, add marker location save location data to parent states
Process:
1. useEffect kickoff mean draw initial canvas
2. when zoom and pan button is clicked, transform the canvas
============================================================================ */
import React, { useEffect, useState, useRef } from "react";
import { select } from "d3-selection";
import { Col, Button } from "antd";
import { zoom, zoomTransform } from "d3-zoom";
import { drag } from "d3-drag";
import { event as currentEvent } from "d3";
import { symbolDiamond } from "d3-shape";
import "./style_CreateMap.css";
import withMeasure from "../hocs/withMeasure";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  LeftSquareOutlined,
  RightSquareOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";

const dimensions = ["width", "height"];
const moment = require("moment");
const _ = require("lodash");

//props.svgMap props.height, props.width, props.locationData, props.setlocationData
const MapEditorChart = props => {
  //states
  const mapeditorCanvasRef = useRef();
  const mapeditorContainerRef = useRef();
  const observedWidth = props.width ? props.width - 10 : 0;
  const observedHeight = props.height ? props.height - 80 : 0;
  const currentZoomStateRef = useRef(null);
  const locationDataRef = useRef([]);

  useEffect(() => {
    console.log("useEffect kickoff");
    if (observedWidth && observedHeight && props.svgMap) {
      const container = select(mapeditorContainerRef.current);
      const canvas = select(mapeditorCanvasRef.current);
      const externalSVGnode = props.svgMap.cloneNode(true);
      const externalSVG_w = +externalSVGnode
        .getAttribute("width")
        .split("px")[0];
      const externalSVG_h = +externalSVGnode
        .getAttribute("height")
        .split("px")[0];

      const container_w = observedWidth;
      const container_h = observedHeight;

      //add image container for external svg
      let img = new Image(),
        serializer = new XMLSerializer(),
        svgStr = serializer.serializeToString(externalSVGnode);
      img.src = "data:image/svg+xml;base64," + window.btoa(svgStr);

      //set canvas attr
      canvas.node().width = container_w;
      canvas.node().height = container_h;

      let ctx = canvas.node().getContext("2d");

      //initial draw
      //we need to assign transform object to the ref, because transform object is differ
      // with regular object (k:1, x:100, y:100) whose doesnt have proptype and methods
      const transform = zoomTransform(canvas.node());
      currentZoomStateRef.current = transform;
      draw();

      //Add location
      container.select("#map-editor-addLocation").on("click", () => {
        const newLocation = { x: 200, y: 240, radius: 10, active: false };
        locationDataRef.current.push(newLocation);
        console.log(currentZoomStateRef.current);

        ctx.clearRect(0, 0, canvas.node().width, canvas.node().height);

        ctx.drawImage(img, 0, 0, externalSVG_w, externalSVG_h);
        if (locationDataRef.current.length > 0) {
          locationDataRef.current.map(d => {
            ctx.beginPath();
            //ctx.moveTo(d.x + d.radius, d.y);
            ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(51, 153, 204, 0.6)";
            ctx.fill();
            if (d.active) {
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            //ctx.stroke();
            return undefined;
          });
        }
        // currentZoomStateRef.current = currentEvent.transform
        //   ? currentEvent.transform
        //   : currentZoomStateRef.current;

        // ctx.save();
        // ctx.clearRect(0, 0, canvas.node().width, canvas.node().height);
        // ctx.translate(
        //   currentZoomStateRef.current.x,
        //   currentZoomStateRef.current.y
        // );
        // ctx.scale(currentZoomStateRef.current.k, currentZoomStateRef.current.k);
        //draw();
        // ctx.restore();
        //props.setlocationData(currentLocationData);
        //console.log(props);
      });

      //Zoom in
      container.select("#map-editor-zoomIn").on("click", () => {
        if (currentZoomStateRef.current.k < 5) {
          let newTransform = currentZoomStateRef.current.scale(1.1);
          console.log(currentZoomStateRef.current);
          console.log(newTransform);
          newTransform;
          currentZoomStateRef.current = newTransform;
          ctx.clearRect(0, 0, canvas.node().width, canvas.node().height);
          ctx.translate(
            currentZoomStateRef.current.x,
            currentZoomStateRef.current.y
          );
          ctx.scale(
            currentZoomStateRef.current.k,
            currentZoomStateRef.current.k
          );

          ctx.drawImage(img, 0, 0, externalSVG_w, externalSVG_h);
          //draw();
        }
      });
      // // Zoom Out
      // container.select("#map-editor-zoomOut").on("click", () => {
      //   if (currentZoomStateRef.current.k < 2) {
      //     currentZoomStateRef.current = currentZoomStateRef.current.scale(0.9);
      //     draw();
      //   }
      //   console.log("out", currentZoomStateRef.current);
      // });

      //draw canvas
      function draw() {
        ctx.clearRect(0, 0, canvas.node().width, canvas.node().height);
        ctx.translate(
          currentZoomStateRef.current.x,
          currentZoomStateRef.current.y
        );
        ctx.scale(currentZoomStateRef.current.k, currentZoomStateRef.current.k);

        ctx.drawImage(img, 0, 0, externalSVG_w, externalSVG_h);

        if (locationDataRef.current.length > 0) {
          locationDataRef.current.map(d => {
            ctx.beginPath();
            //ctx.moveTo(d.x + d.radius, d.y);
            ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(51, 153, 204, 0.6)";
            ctx.fill();
            if (d.active) {
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            //ctx.stroke();
            return undefined;
          });
        }
      }

      function currentDrag(circles) {
        // Choose the circle that is closest to the pointer for dragging.
        function dragsubject() {
          let subject = null;
          let distance = 10;
          if (circles.length > 0) {
            for (const c of circles) {
              let d = Math.hypot(currentEvent.x - c.x, currentEvent.y - c.y);
              if (d < distance) {
                distance = d;
                subject = c;
              }
            }
          }
          //if subject is null, let them know this is a canvas
          console.log(subject);
          return subject;
        }

        // When dragging, update the subject’s position.
        function dragged() {
          console.log("dragging ...");
          currentEvent.subject.x = currentEvent.x;
          currentEvent.subject.y = currentEvent.y;
          draw();
        }

        // When ending a drag gesture, mark the subject as inactive again.
        function dragended() {
          console.log("dragend!");
          currentEvent.subject.active = false;
        }

        return drag()
          .subject(dragsubject)
          .on("drag", dragged)
          .on("end", dragended);
      }

      canvas.call(currentDrag(locationDataRef.current));
    }
  }, [props.svgMap, observedWidth, observedHeight]);

  return (
    <React.Fragment>
      <div id="map-editor-container" ref={mapeditorContainerRef}>
        <div id="map-editor-buttons-container">
          <div>
            <Button
              id={"map-editor-panUp"}
              size={"medium"}
              icon={<UpSquareOutlined />}
            ></Button>
          </div>
          <div>
            <Button
              id={"map-editor-panLeft"}
              size={"medium"}
              icon={<LeftSquareOutlined />}
            ></Button>
            <Button
              id={"map-editor-panRight"}
              size={"medium"}
              icon={<RightSquareOutlined />}
            ></Button>
          </div>
          <div>
            <Button
              id={"map-editor-panDown"}
              size={"medium"}
              icon={<DownSquareOutlined />}
            ></Button>
          </div>
          <div style={{ width: "35px", margin: "20px auto" }}>
            <Button
              id={"map-editor-zoomIn"}
              size={"medium"}
              icon={<ZoomInOutlined />}
            ></Button>
            <Button
              id={"map-editor-zoomOut"}
              size={"medium"}
              icon={<ZoomOutOutlined />}
            ></Button>
          </div>
          <div>
            <Button
              id={"map-editor-addLocation"}
              size={"medium"}
              icon={<PlusCircleOutlined />}
            ></Button>
          </div>
        </div>
        <div id="map-editor-tooltip"></div>
        <canvas id="map-editor-canvas" ref={mapeditorCanvasRef}></canvas>
      </div>
    </React.Fragment>
  );
};

const MapEditorChartContainer = props => {
  return (
    <React.Fragment>
      <Col id="map-editor-map" xs={24} lg={15}>
        <MapEditorChart
          svgMap={props.svgMap}
          locationData={props.locationData}
          setlocationData={props.setlocationData}
          width={props.width}
          height={props.height}
        />
      </Col>
    </React.Fragment>
  );
};

const MeasuredMapEditorChartContainer = withMeasure(dimensions)(
  MapEditorChartContainer
);

export default MeasuredMapEditorChartContainer;

/*
const MapEditorChart = props => {
  //states
  const mapeditorCanvasRef = useRef();
  const mapeditorContainerRef = useRef();
  const hoveredDataRef = useRef();
  const clickedDataRef = useRef();
  const observedWidth = props.width ? props.width - 10 : 0;
  const observedHeight = props.height ? props.height - 80 : 0;
  const currentZoomStateRef = useRef({ k: 1, x: 0, y: 0 });
  const locationDataRef = useRef([]);
  const [currentZoomState, setCurrentZoomState] = useState({
    k: 1,
    x: 0,
    y: 0
  });

  useEffect(() => {
    console.log("useEffect kickoff");
    if (observedWidth && observedHeight && props.svgMap) {
      const container = select(mapeditorContainerRef.current);
      const canvas = select(mapeditorCanvasRef.current);
      const externalSVGnode = props.svgMap.cloneNode(true);
      const externalSVG_w = +externalSVGnode
        .getAttribute("width")
        .split("px")[0];
      const externalSVG_h = +externalSVGnode
        .getAttribute("height")
        .split("px")[0];

      const container_w = observedWidth;
      const container_h = observedHeight;

      //add image container for external svg
      let img = new Image(),
        serializer = new XMLSerializer(),
        svgStr = serializer.serializeToString(externalSVGnode);
      img.src = "data:image/svg+xml;base64," + window.btoa(svgStr);

      //set canvas attr
      canvas.node().width = container_w;
      canvas.node().height = container_h;

      let ctx = canvas.node().getContext("2d");

      //initial draw
      draw();

      //zoom functionality
      const zoomHandler = zoom()
        .scaleExtent([0.1, 8])
        .on("zoom", () => {
          //const zoomState = zoomTransform(canvas.node());
          //console.log(zoomState);
          currentZoomStateRef.current = currentEvent.transform;

          ctx.save();
          ctx.clearRect(0, 0, canvas.node().width, canvas.node().height);
          ctx.translate(
            currentZoomStateRef.current.x,
            currentZoomStateRef.current.y
          );
          ctx.scale(
            currentZoomStateRef.current.k,
            currentZoomStateRef.current.k
          );
          draw();
          ctx.restore();

          //setCurrentZoomState(zoomState);
        });
      // .filter(function() {
      //   console.log(currentEvent);
      //   return currentEvent.button && currentEvent.type !== "wheel";
      // });

      canvas.call(zoomHandler);

      // canvas.on("mousemove", () => {
      //   let translatedMouseX = currentZoomState.invertX
      //     ? currentZoomState.invertX(currentEvent.offsetX)
      //     : currentEvent.offsetX;
      //   let translatedMouseY = currentZoomState.invertY
      //     ? currentZoomState.invertY(currentEvent.offsetY)
      //     : currentEvent.offsetY;
      //
      //   // find data that has that coordinates
      //   hoveredDataRef.current = data.find(d => {
      //     return (
      //       Math.abs(d.x - translatedMouseX) < 10 &&
      //       Math.abs(d.y - translatedMouseY) < 10
      //     );
      //   });
      //
      //   if (hoveredDataRef.current) {
      //     container
      //       .select("#map-editor-tooltip")
      //       .html(
      //         "Name: " +
      //           hoveredDataRef.current.name +
      //           "<br>" +
      //           "Isolates: " +
      //           hoveredDataRef.current.total
      //       )
      //       .style("opacity", 100)
      //       .style("margin-top", currentEvent.offsetY - 10 + "px")
      //       .style("margin-left", currentEvent.offsetX + 10 + "px");
      //   } else {
      //     container.select("#map-editor-tooltip").style("opacity", 0);
      //   }
      // });

      // canvas.on("click", () => {
      //   if (hoveredDataRef.current) {
      //     clickedDataRef.current = hoveredDataRef.current;
      //     update();
      //   }
      // });

      container.select("#map-editor-addLocation").on("click", () => {
        const newLocation = { x: 200, y: 240, radius: 30, active: false };
        locationDataRef.current.push(newLocation);
        currentZoomStateRef.current = currentEvent.transform
          ? currentEvent.transform
          : currentZoomStateRef.current;

        ctx.save();
        ctx.clearRect(0, 0, canvas.node().width, canvas.node().height);
        ctx.translate(
          currentZoomStateRef.current.x,
          currentZoomStateRef.current.y
        );
        ctx.scale(currentZoomStateRef.current.k, currentZoomStateRef.current.k);
        draw();
        ctx.restore();
        //props.setlocationData(currentLocationData);
        //console.log(props);
      });

      //draw canvas
      function draw() {
        //clean previous drawing artifacts
        //select("#tree_svgGroup").remove();
        ctx.clearRect(0, 0, canvas.node().width, canvas.node().height);
        ctx.translate(
          currentZoomStateRef.current.x,
          currentZoomStateRef.current.y
        );
        ctx.scale(currentZoomStateRef.current.k, currentZoomStateRef.current.k);

        ctx.drawImage(img, 0, 0, externalSVG_w, externalSVG_h);

        if (locationDataRef.current.length > 0) {
          locationDataRef.current.map(d => {
            ctx.beginPath();
            //ctx.moveTo(d.x + d.radius, d.y);
            ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(51, 153, 204, 0.6)";
            ctx.fill();
            if (d.active) {
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            //ctx.stroke();
            return undefined;
          });
        }
      }

      const currentDrag = circles => {
        // Choose the circle that is closest to the pointer for dragging.
        function dragsubject() {
          let subject = null;
          let distance = 15;
          if (circles) {
            for (const c of circles) {
              let d = Math.hypot(currentEvent.x - c.x, currentEvent.y - c.y);
              if (d < distance) {
                distance = d;
                subject = c;
              }
            }
          }
          console.log(subject);
          return subject;
        }

        // When dragging, update the subject’s position.
        function dragged() {
          currentEvent.subject.x = currentEvent.x;
          currentEvent.subject.y = currentEvent.y;
          draw();
        }

        // When ending a drag gesture, mark the subject as inactive again.
        function dragended() {
          console.log("dragend");
          currentEvent.subject.active = false;
        }

        return drag()
          .subject(dragsubject)
          .on("drag", dragged)
          .on("end", dragended);
      };

      //   .on("mousedown.zoom", null)
      //   .on("touchstart.zoom", null)
      //   .on("touchmove.zoom", null)
      //   .on("touchend.zoom", null);

      //canvas.call(currentDrag(data));
    }
  }, [
    props.svgMap,
    props.locationData,
    observedWidth,
    observedHeight,
    currentZoomState
  ]);

  return (
    <React.Fragment>
      <div id="map-editor-container" ref={mapeditorContainerRef}>
        <div id="map-editor-buttons-container">
          <div>
            <Button
              id={"map-editor-panUp"}
              size={"medium"}
              icon={<UpSquareOutlined />}
            ></Button>
          </div>
          <div>
            <Button
              id={"map-editor-panLeft"}
              size={"medium"}
              icon={<LeftSquareOutlined />}
            ></Button>
            <Button
              id={"map-editor-panRight"}
              size={"medium"}
              icon={<RightSquareOutlined />}
            ></Button>
          </div>
          <div>
            <Button
              id={"map-editor-panDown"}
              size={"medium"}
              icon={<DownSquareOutlined />}
            ></Button>
          </div>
          <div style={{ width: "35px", margin: "20px auto" }}>
            <Button
              id={"map-editor-zoomIn"}
              size={"medium"}
              icon={<ZoomInOutlined />}
            ></Button>
            <Button
              id={"map-editor-zoomOut"}
              size={"medium"}
              icon={<ZoomOutOutlined />}
            ></Button>
          </div>
          <div>
            <Button
              id={"map-editor-addLocation"}
              size={"medium"}
              icon={<PlusCircleOutlined />}
            ></Button>
          </div>
        </div>
        <div id="map-editor-tooltip"></div>
        <canvas id="map-editor-canvas" ref={mapeditorCanvasRef}></canvas>
      </div>
    </React.Fragment>
  );
};
*/
