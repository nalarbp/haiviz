import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { ascending } from "d3-array";
import "./style_ColorScale.css";
import { Modal, Empty } from "antd";
import { scaleBand } from "d3-scale";
import { downloadSVG } from "../utils/utils";
import { ChromePicker } from "react-color";
import usePrevious from "../react_hooks/usePrevious-hook";

const _ = require("lodash");

const ColorScaleChart = (props) => {
  const [displayColorPicker, setdisplayColorPicker] = useState(false);
  const [selectedColorPicker, setselectedColorPicker] = useState({
    name: null,
    color: "#ccc",
  });

  // this constructror will be recalled when props from parent change, so just put it here
  const colorscaleSVGRef = useRef();
  const colorscaleContainerRef = useRef();
  const svg = select(colorscaleSVGRef.current);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const container_w = observedWidth;
  const container_h = observedHeight;
  const colorscale_width = container_w - margin.left - margin.right;
  const colorscale_height = container_h - margin.top - margin.bottom - 10;
  const prevDimension = usePrevious(observedWidth + observedHeight);
  const isInitialDraw = prevDimension && prevDimension < 0 ? true : false;

  //SETTINGS
  const isUserStartResize = props.colorscaleSettings.isUserStartResize;
  const isDownloading = props.colorscaleSettings.isDownloading;

  //USE-EFFECTS
  useEffect(() => {
    if (isUserStartResize) {
      select("#colorCont").remove();
      select("#colorscale-svg").style("display", "none");
      select("#colorscale-buttons-container").style("display", "none");
      select("#colorscale-no-drawing").style("display", "block");
    } else {
      if (isInitialDraw) {
        draw();
      } else {
        if (props.isUserRedraw) {
          draw();
        }
      }
    }
  }, [isInitialDraw, isUserStartResize, props.isUserRedraw]);

  useEffect(() => {
    if (props.colorScale.colorType) {
      draw();
    }
  }, [props.colorScale]);

  useEffect(() => {
    if (selectedColorPicker && selectedColorPicker.name) {
      //selectedColorPicker is a single hex color
      let active_colorType = props.colorScale.colorType;
      let new_colorMap = _.cloneDeep(props.colorScale.colorMap);
      let colorAttribute = selectedColorPicker.name;
      let new_color = selectedColorPicker.color;

      //loop over new_colorMap[active_colorType], find the colorAttribute and change the color
      new_colorMap[active_colorType].forEach((v, k) => {
        if (v.colorAttribute === colorAttribute) {
          v.colorValue = new_color;
        }
      });
      props.setColorScale({
        colorType: active_colorType,
        colorMap: new_colorMap,
      });
      //based on active colorScale.colorType we want to change colorScale so we need a swicth
      //changeColorScaleState(selectedColorPicker, props.colorScale);
    }
  }, [selectedColorPicker]);

  useEffect(() => {
    if (isDownloading) {
      //create temp svg
      const colorCategory = props.colorScale.colorType;
      const currentColorMap = props.colorScale.colorMap[colorCategory];
      const colorData = Array.from(currentColorMap.entries());
      const colorObj = colorData
        .map((d) => {
          return { name: d[1].colorAttribute, color: d[1].colorValue };
        })
        .filter(
          (d, i, self) =>
            i ===
            self.findIndex((t) => t.name === d.name && t.color === d.color)
        )
        .sort(function(x, y) {
          return ascending(x.name, y.name);
        });

      const colorList = colorObj.map((d) => d.name);
      const temp_svg_h = colorList.length * 20;

      const temp_colorCont = svg
        .append("div")
        .attr("id", "temp_colorCont")
        .style("display", "none");
      const temp_colorSVG = temp_colorCont
        .append("svg")
        .attr("id", "color-scale-svg")
        .attr("width", colorscale_width)
        .attr("height", temp_svg_h);

      const scale_y = scaleBand()
        .domain(colorList)
        .range([0, temp_svg_h])
        .paddingInner(0.1)
        .paddingOuter(0.1);
      //col rect
      temp_colorSVG
        .selectAll(".tempColScale-rect")
        .data(colorObj)
        .enter()
        .append("rect")
        .attr("class", "tempColScale-rect")
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px")
        .attr("fill", (d) => d.color)
        .attr("x", 0)
        .attr("y", (d) => scale_y(d.name))
        .attr("width", 20)
        .attr("height", 20);
      temp_colorSVG
        .selectAll(".tempColScale-text")
        .data(colorObj)
        .enter()
        .append("text")
        .attr("class", "tempColScale-text")
        .attr("text-anchor", "start")
        .attr("x", 25)
        .attr("y", (d) => scale_y(d.name) + 12)
        .attr("fill", "black")
        .text((d) => d.name)
        .style("font-size", "12px");

      downloadSVG("color-scale-svg");
      select("#temp_colorCont").remove();
      props.changeIsColorScaleDownloading(false);
    }
  }, [isDownloading]);

  //DRAWING
  function draw() {
    select("#colorscale-no-drawing").style("display", "none");
    select("#colorscale-buttons-container").style("display", "block");
    select("#colorCont").remove();
    select("#colorscale-svg").style("display", "block");
    svg.style("height", colorscale_height + margin.top + margin.bottom + "px");

    const colorCategory = props.colorScale.colorType;
    const currentColorMap = props.colorScale.colorMap[colorCategory];
    const colorData = Array.from(currentColorMap.entries());
    //console.log(colorCategory, currentColorMap);
    const colorObj = colorData
      .map((d) => {
        return { name: d[1].colorAttribute, color: d[1].colorValue };
      })
      .filter(
        (d, i, self) =>
          i === self.findIndex((t) => t.name === d.name && t.color === d.color)
      )
      .sort(function(x, y) {
        return ascending(x.name, y.name);
      });

    const colorCont = svg.append("div").attr("id", "colorCont");
    const colorList = colorCont
      .selectAll(".colColumn")
      .data(colorObj)
      .enter()
      .append("div")
      .attr("class", "colColumn")
      .style("width", colorscale_width + margin.left + "px")
      .style("height", "22px")
      .style("margin", "1px auto")
      .style("overflowX", "auto");

    //add color rectangle
    colorList
      .append("div")
      .style("width", "20px")
      .style("height", "20px")
      .style("display", "inline-block")
      .style("float", "left")
      .style("margin-right", "3px")
      .append("svg")
      .attr("class", "colorRect")
      .attr("width", "20px")
      .attr("height", "20px")
      .append("rect")
      .attr("width", "20px")
      .attr("height", "20px")
      .attr("fill", (d) => d.color)
      .style("cursor", "pointer")
      .on("click", (d) => {
        setselectedColorPicker(d);
        setdisplayColorPicker(true);
      });

    //add color text
    colorList
      .append("div")
      .style("height", "20px")
      .style("float", "left")
      .style("display", "inline-block")
      .append("p")
      .text((d) => d.name)
      .style("font-size", "12px");
  }

  //HANDLERS
  const closeColorPickerHandler = () => {
    setdisplayColorPicker(false);
  };

  const setColorPickerHandler = (col) => {
    let newCol = _.cloneDeep(selectedColorPicker);
    newCol.color = col.hex;
    setselectedColorPicker(newCol);
  };

  return (
    <React.Fragment>
      <div id="colorscaleContainer" ref={colorscaleContainerRef}>
        <div id="colorscale-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <Modal
          title="Color picker"
          visible={displayColorPicker}
          onOk={closeColorPickerHandler}
          onCancel={closeColorPickerHandler}
          centered={true}
          footer={null}
          width={280}
        >
          <ChromePicker
            disableAlpha={true}
            color={selectedColorPicker.color}
            onChangeComplete={setColorPickerHandler}
          />
        </Modal>
        <div
          id="colorscale-svg"
          ref={colorscaleSVGRef}
          style={{
            overflow: "auto",
          }}
        ></div>
      </div>
    </React.Fragment>
  );
};

export default ColorScaleChart;
