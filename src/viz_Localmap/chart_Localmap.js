/* ============================================================================

============================================================================ */
import React, { useEffect, useState, useRef } from "react";
import { select } from "d3-selection";
import { zoom, zoomTransform } from "d3-zoom";
import { event as currentEvent } from "d3";
import "./style_Localmap.css";

const moment = require("moment");

const LocalmapChart = props => {
  //states
  const localmapCanvasRef = useRef();
  const localmapContainerRef = useRef();
  const hoveredDataRef = useRef();
  const clickedDataRef = useRef();
  const observedWidth = props.width ? props.width - 10 : 0;
  const observedHeight = props.height ? props.height - 80 : 0;
  const [currentZoomState, setCurrentZoomState] = useState({
    k: 1,
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (observedWidth && observedHeight && props.data) {
      const data = props.data.data;
      const container = select(localmapContainerRef.current);
      const canvas = select(localmapCanvasRef.current);
      //const propsSVGNode = props.data.xmlSVG.cloneNode(true);
      const externalSVGnode = props.data.xmlSVG.cloneNode(true);
      //const externalSVGnode = propsSVGNode.documentElement; //the svg
      externalSVGnode.setAttribute("id", "externalSVG");
      const externalSVG_w = +externalSVGnode
        .getAttribute("width")
        .split("px")[0];
      const externalSVG_h = +externalSVGnode
        .getAttribute("height")
        .split("px")[0];
      if (!externalSVG_w || !externalSVG_h) return;

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
      draw();

      canvas.on("mousemove", () => {
        let translatedMouseX = currentZoomState.invertX
          ? currentZoomState.invertX(currentEvent.offsetX)
          : currentEvent.offsetX;
        let translatedMouseY = currentZoomState.invertY
          ? currentZoomState.invertY(currentEvent.offsetY)
          : currentEvent.offsetY;

        // find data that has that coordinates
        hoveredDataRef.current = data.find(d => {
          return (
            Math.abs(d.x - translatedMouseX) < 10 &&
            Math.abs(d.y - translatedMouseY) < 10
          );
        });

        if (hoveredDataRef.current) {
          container
            .select("#localmap-tooltip")
            .html(
              "Name: " +
                hoveredDataRef.current.name +
                "<br>" +
                "Isolates: " +
                hoveredDataRef.current.total
            )
            .style("opacity", 100)
            .style("margin-top", currentEvent.offsetY - 10 + "px")
            .style("margin-left", currentEvent.offsetX + 10 + "px");
        } else {
          container.select("#localmap-tooltip").style("opacity", 0);
        }
      });

      canvas.on("click", () => {
        if (hoveredDataRef.current) {
          clickedDataRef.current = hoveredDataRef.current;
          update();
        }
      });

      //zoom functionality
      const zoomBehavior = zoom()
        .scaleExtent([0.1, 10])
        //.translateExtent([[-100, 0], [container_w, container_h]])
        .on("zoom", () => {
          const zoomState = zoomTransform(canvas.node());
          //console.log(zoomState);
          // ctx.save();
          // ctx.clearRect(0, 0, container_w, container_h);
          // ctx.translate(currentEvent.transform.x, currentEvent.transform.y);
          // ctx.scale(currentEvent.transform.k, currentEvent.transform.k);
          // draw();
          // ctx.restore();
          setCurrentZoomState(zoomState);
        });

      //draw canvas
      function draw() {
        ctx.clearRect(0, 0, container_w, container_h);
        ctx.translate(currentZoomState.x, currentZoomState.y);
        ctx.scale(currentZoomState.k, currentZoomState.k);

        ctx.drawImage(img, 0, 0, externalSVG_w, externalSVG_h);
        data.map(d => {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.total, 0, Math.PI * 2, 1);
          ctx.fillStyle = "rgba(51, 153, 204, 0.6)";
          if (clickedDataRef.current) {
            if (d.name === clickedDataRef.current.name) {
              ctx.fillStyle = "rgba(51, 153, 204, 0.6)";
            } else {
              ctx.fillStyle = "lightgray";
            }
          }
          ctx.fill();
          //ctx.stroke();
          return undefined;
        });
      }

      //update canvas
      function update() {
        ctx.clearRect(0, 0, container_w, container_h);
        ctx.drawImage(img, 0, 0, externalSVG_w, externalSVG_h);
        data.map(d => {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.total, 0, Math.PI * 2, 1);
          ctx.fillStyle =
            d === hoveredDataRef.current
              ? "rgba(51, 153, 204, 0.6)"
              : "lightgray";
          ctx.fill();
          ctx.stroke();
          return undefined;
        });
      }

      canvas.call(zoomBehavior);
    }
  }, [props.data, observedWidth, observedHeight, currentZoomState]);

  return (
    <React.Fragment>
      <div id="localmapContainer" ref={localmapContainerRef}>
        <div id="localmap-tooltip"></div>
        <canvas id="localmap-canvas" ref={localmapCanvasRef}></canvas>
      </div>
    </React.Fragment>
  );
};

export default LocalmapChart;
