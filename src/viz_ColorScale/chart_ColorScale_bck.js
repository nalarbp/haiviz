/* ============================================================================
props.loadTreeData(colorscale);//
============================================================================ */
import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import "./style_ColorScale.css";
import { Empty, Button, Select } from "antd";
import d3Grid from "../utils/d3Grid";
import { getColorScale } from "../utils/utils";
import { ChromePicker } from "react-color";
import { ReloadOutlined, FormatPainterFilled } from "@ant-design/icons";

const { Option } = Select;
const _ = require("lodash");

const ColorScaleChart = props => {
  //INTERNAL STATES
  const [selectedCategory, setselectedCategory] = useState("location");
  const [displayColorPicker, setdisplayColorPicker] = useState(false);
  const [selectedColorPicker, setselectedColorPicker] = useState({
    name: null,
    color: "#ccc"
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

  const rectGrid = d3Grid()
    .bands()
    .size([colorscale_width, colorscale_height])
    .padding([1, 1]);

  //SETTINGS
  const isUserStartResize = props.colorscaleSettings.isUserStartResize;
  const textSize = props.colorscaleSettings.textSize;

  //USE-EFFECTS
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
      // reset currentEvent.zoom transform
    } else {
      //console.log("hide and remove");
      select("#colorCont").remove();
      select("#colorscale-svg").style("display", "none");
      //select("#colorscale_svgGroup").remove();
      select("#colorscale-buttons-container").style("display", "none");
      select("#colorscale-no-drawing").style("display", "block");
    }
  }, [observedWidth, observedHeight, isUserStartResize, props.isUserRedraw]);
  useEffect(() => {
    if (selectedCategory) {
      props.setColorScaleType(selectedCategory);
    }
  }, [selectedCategory]);
  useEffect(() => {
    if (props.colorScale.colorType) {
      draw();
    }
  }, [props.colorScale]);
  useEffect(() => {
    if (selectedColorPicker) {
      //based on active colorScale.colorType we want to change colorScale so we need a swicth
      changeColorScaleState(selectedColorPicker, props.colorScale);
    }
  }, [selectedColorPicker]);

  //
  //DRAWING
  function draw() {
    //clean previous drawing artifacts

    select("#colorscale-no-drawing").style("display", "none");
    select("#colorscale-buttons-container").style("display", "block");
    //select("#colorscale_svgGroup").remove();
    select("#colorCont").remove();
    select("#colorscale-svg").style("display", "block");
    svg.style("height", colorscale_height + margin.top + margin.bottom + "px");

    const currentColorScale = getColorScale(props.colorScale);

    const colorData = Array.from(currentColorScale.entries()).filter(
      d => d[0] !== null
    );

    const colorObj = colorData.map(d => {
      return { name: d[0], color: d[1] };
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

    const colorRect = colorList
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
      .attr("fill", d => d.color)
      .on("click", d => {
        setselectedColorPicker(d);
        setdisplayColorPicker(true);
      });

    const colorText = colorList
      .append("div")
      .style("height", "20px")
      .style("float", "left")
      .style("display", "inline-block")
      .append("p")
      .text(d => d.name)
      .style("font-size", "12px");

    // let gridData = rectGrid(
    //   colorData.map(d => {
    //     return { name: d[0], color: d[1] };
    //   })
    // );
    //console.log(gridData);

    //set svg attributes
    //   svg
    //     .attr("width", colorscale_width + margin.left + margin.right)
    //     .attr("height", colorscale_height + margin.top + margin.bottom);
    //
    //   //make group root of svg for transformation purpose
    //   let svgGroup = svg
    //     .append("g")
    //     .attr("id", "colorscale_svgGroup")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //
    //   let rectGroup = svgGroup.append("g").attr("id", "colorscale_rectGroup");
    //   rectGroup
    //     .selectAll(".rect")
    //     .data(gridData)
    //     .enter()
    //     .append("rect")
    //     .attr("class", "rect")
    //     .attr("width", rectGrid.nodeSize()[0])
    //     .attr("height", rectGrid.nodeSize()[1])
    //     .attr("transform", function(d) {
    //       return "translate(" + d.x + "," + d.y + ")";
    //     })
    //     .attr("fill", d => d.color)
    //     .on("click", d => {
    //       setselectedColorPicker(d);
    //       setdisplayColorPicker(true);
    //     })
    //     .append("title")
    //     .text(d => `${d.name}`);
    //
    //   let labelGroup = svgGroup.append("g").attr("id", "colorscale_labelGroup");
    //   labelGroup
    //     .selectAll(".colorscale_label")
    //     .data(gridData)
    //     .enter()
    //     .append("text")
    //     .attr("class", "colorscale_label")
    //     .attr("dx", d => d.x)
    //     .attr("dy", d => d.y - 1)
    //     .attr("text-anchor", "start")
    //     .attr("font-size", d => textSize)
    //     .attr("fill", "black")
    //     .text(d => d.name);
  }

  //FUNCTIONS
  function changeColorScaleState(pickedCol, scaleColor) {
    switch (scaleColor.colorType) {
      case "species":
        let species_col = _.cloneDeep(scaleColor.bySpecies);
        species_col.set(pickedCol.name, pickedCol.color);
        props.setColorBySpecies(species_col);
        break;
      case "location":
        let location_col = _.cloneDeep(scaleColor.byLocation);
        location_col.set(pickedCol.name, pickedCol.color);
        props.setColorByLocation(location_col);
        break;
      case "sourceType":
        let sourceType_col = _.cloneDeep(scaleColor.bySourceType);
        sourceType_col.set(pickedCol.name, pickedCol.color);
        props.setColorBySourceType(sourceType_col);
        break;
      case "profile1":
        let profile1_col = _.cloneDeep(scaleColor.byProfile1);
        profile1_col.set(pickedCol.name, pickedCol.color);
        props.setColorByProfile1(profile1_col);
        break;
      case "profile2":
        let profile2_col = _.cloneDeep(scaleColor.byProfile2);
        profile2_col.set(pickedCol.name, pickedCol.color);
        props.setColorByProfile2(profile2_col);
        break;
      case "profile3":
        let profile3_col = _.cloneDeep(scaleColor.byProfile3);
        profile3_col.set(pickedCol.name, pickedCol.color);
        props.setColorByProfile3(profile3_col);
        break;
      default:
    }
  }
  function grayColorScaleState(scaleColor) {
    switch (scaleColor.colorType) {
      case "species":
        let species_col = _.cloneDeep(scaleColor.bySpecies);
        species_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorBySpecies(species_col);
        break;
      case "location":
        let location_col = _.cloneDeep(scaleColor.byLocation);
        location_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByLocation(location_col);
        break;
      case "sourceType":
        let sourceType_col = _.cloneDeep(scaleColor.bySourceType);
        sourceType_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorBySourceType(sourceType_col);
        break;
      case "profile1":
        let profile1_col = _.cloneDeep(scaleColor.byProfile1);
        profile1_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByProfile1(profile1_col);
        break;
      case "profile2":
        let profile2_col = _.cloneDeep(scaleColor.byProfile2);
        profile2_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByProfile2(profile2_col);
        break;
      case "profile3":
        let profile3_col = _.cloneDeep(scaleColor.byProfile3);
        profile3_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByProfile3(profile3_col);
        break;
      default:
    }
  }
  function resetColorScaleState(scaleColor) {
    switch (scaleColor.colorType) {
      case "species":
        let species_col = _.cloneDeep(scaleColor.bySpecies_ori);
        props.setColorBySpecies(species_col);
        break;
      case "location":
        let location_col = _.cloneDeep(scaleColor.byLocation_ori);
        props.setColorByLocation(location_col);
        break;
      case "sourceType":
        let sourceType_col = _.cloneDeep(scaleColor.bySourceType_ori);
        props.setColorBySourceType(sourceType_col);
        break;
      case "profile1":
        let profile1_col = _.cloneDeep(scaleColor.byProfile1_ori);
        props.setColorByProfile1(profile1_col);
        break;
      case "profile2":
        let profile2_col = _.cloneDeep(scaleColor.byProfile2_ori);
        props.setColorByProfile2(profile2_col);
        break;
      case "profile3":
        let profile3_col = _.cloneDeep(scaleColor.byProfile3_ori);
        props.setColorByProfile3(profile3_col);
        break;
      default:
    }
  }

  //HANDLERS
  const setColorScaleHandler = value => {
    setselectedCategory(value);
  };
  const closeColorPickerHandler = () => {
    setdisplayColorPicker(false);
  };
  const grayAllOutHandler = () => {
    grayColorScaleState(props.colorScale);
  };
  const resetColorHandler = () => {
    resetColorScaleState(props.colorScale);
  };
  const setColorPickerHandler = col => {
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
        <div
          id="colorscale-buttons-container"
          style={{ height: "40px", overflowX: "auto", marginBottom: "5px" }}
        >
          <Select
            id={"colorscale-select"}
            style={{ width: "auto", marginBottom: "2px" }}
            placeholder={selectedCategory}
            onChange={setColorScaleHandler}
          >
            <Option value="location">Location</Option>
            <Option value="species">Species</Option>
            <Option value="sourceType">Source type</Option>
            <Option value="profile1">Profile 1</Option>
            <Option value="profile2">Profile 2</Option>
            <Option value="profile3">Profile 3</Option>
          </Select>
          <Button
            id={"colorscale-grayAll"}
            title={"Change all color to gray"}
            onClick={grayAllOutHandler}
          >
            <FormatPainterFilled />
          </Button>
          <Button
            id={"colorscale-resetColor"}
            title={"Reset all color"}
            onClick={resetColorHandler}
          >
            <ReloadOutlined />
          </Button>
        </div>
        {displayColorPicker ? (
          <div id="color-picker-container">
            <div id="color-picker-cover" onClick={closeColorPickerHandler} />
            <ChromePicker
              disableAlpha={true}
              color={selectedColorPicker.color}
              onChangeComplete={setColorPickerHandler}
            />
          </div>
        ) : null}
        <div id="colorscale-tooltip"></div>
        <div
          id="colorscale-svg"
          ref={colorscaleSVGRef}
          style={{
            overflow: "auto"
          }}
        ></div>
      </div>
    </React.Fragment>
  );
};

export default ColorScaleChart;

/*
{displayColorPicker ? (
  <div id="color-picker-container">
    <div id="color-picker-cover" onClick={closeColorPickerHandler} />
    <ChromePicker
      disableAlpha={true}
      color={selectedColorPicker.color}
      onChangeComplete={setColorPickerHandler}
    />
  </div>
) : null}
<div id="colorscale-tooltip"></div>
<svg id="colorscale-svg" ref={colorscaleSVGRef}></svg>
*/
