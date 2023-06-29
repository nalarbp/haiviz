/* ============================================================================
PROBLEM: D3 brush currentEvent state is interfered by ract grid layout postion
So we can only use gid 0,0 and make it non resizeable
============================================================================ */
import React, { useEffect, useRef, useState } from "react";
import { extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { select } from "d3-selection";
import { Empty, Button } from "antd";
import { brushX } from "d3-brush";
import { scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { event as currentEvent } from "d3";
import { filterUnique, getColorScaleByObject } from "../utils/utils";
import "./style_TemporalBar.css";
import { PlayCircleOutlined, BorderOutlined } from "@ant-design/icons";

const moment = require("moment");

const TemporalStackedBar = (props) => {
  //states
  const [selectionDate, setselectionDate] = useState(null);
  const temporalbarSVGRef = useRef();
  const temporalbarContainerRef = useRef();
  const animPlayer = useRef([]);
  const animIsPlaying = useRef(false);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 100; //ofsett by card head
  const svg = select(temporalbarSVGRef.current);
  const margin = { top: 10, right: 20, bottom: 10, left: 30 };
  const temporalbar_w = observedWidth - margin.left - margin.right;
  const temporalbar_h = observedHeight - margin.top - margin.bottom - 10;

  //SETTINGS

  const isUserStartResize = props.temporalbarSettings.isUserStartResize;
  const scaleMode = props.temporalbarSettings.scaleMode;
  //const animIsPlaying = props.temporalbarSettings.isAnimationPlaying;

  //USEEFFECTS
  useEffect(() => {
    if (!isUserStartResize && !props.isUserRedraw) {
      draw(); //when initial draw
    } else if (!isUserStartResize && props.isUserRedraw) {
      draw(); //when user click redraw
    } else {
      //console.log("hide and remove");
      select("#temporalbar-svgGroup").remove();
      select("#temporalbar-buttons-container").style("display", "none");
      select("#temporalbar-no-drawing").style("display", "block");
    }
  }, [
    observedWidth,
    observedHeight,
    props.chartData,
    isUserStartResize,
    props.isUserRedraw,
  ]);

  useEffect(() => {
    if (props.selectedData && props.selectedData.length > 0) {
      updateBySelectedData();
    } else if (props.selectedData && props.selectedData.length === 0) {
      clearSelectedData();
    }
  }, [props.selectedData]);

  // useEffect(() => {
  //   if (props.colorScale.colorType) {
  //     svg.selectAll(".temporal-bar-rectangle").attr("fill", (e) => {
  //       let obj = props.isolateData.get(e.isolate_name);
  //       let col = getColorScaleByObject(obj, props.colorScale);
  //       return col;
  //     });
  //   }
  // }, [props.colorScale]);

  useEffect(() => {
    if (selectionDate) {
      const cont = select(temporalbarContainerRef.current);
      cont.select("#selection-date-text").text(() => {
        return (
          " " +
          moment(selectionDate[0]).format("D MMMM YYYY") +
          " - " +
          moment(selectionDate[1]).format("D MMMM YYYY")
        );
      });
    }
  }, [selectionDate]);

  //draw function: heavy processes like drawing each data points are here
  function draw() {
    const svg = select(temporalbarSVGRef.current);
    const dateArr = Array.from(props.isolateData.values()).map(
      (d) => d.isolate_colDate
    );
    const dateRange = extent(dateArr);
    const chartDataArr = Array.from(props.chartData.entries());
    const frequencyRange = extent(chartDataArr.map((d) => d[1].length));
    const barHeight = temporalbar_h / frequencyRange[1];
    //clean previous drawing artifacts
    select("#temporalbar-svgGroup").remove();
    select("#temporalbar-buttons-container").style("display", "block");
    select("#temporalbar-no-drawing").style("display", "none");
    //set svg attributes
    svg
      .attr("width", temporalbar_w + margin.left + margin.right)
      .attr("height", temporalbar_h + margin.top + margin.bottom);

    //scale
    const scale_x = scaleTime()
      .domain([
        moment(dateRange[0]).subtract(2, "weeks"),
        moment(dateRange[1]).add(2, "weeks"),
      ])
      .range([0, temporalbar_w]);
    //.nice(); -> make to inconsistent scale offset, without it we have consistent offset that is 1 week before and after
    const scale_y = scaleLinear()
      .domain([0, frequencyRange[1]])
      .range([temporalbar_h, 0]);

    //axis
    const axis_x = axisBottom()
      .scale(scale_x)
      .tickSize([5])
      .tickFormat(timeFormat("%Y-%m"));
    const axis_y = axisLeft()
      .scale(scale_y)
      .tickSize([5]);

    //animation
    let animDateIntervalMilliseconds = dateArr
      .map((d) => d.getTime())
      .filter(filterUnique);

    let animDateInterval = animDateIntervalMilliseconds
      .map(function(d) {
        return new Date(d);
      })
      .sort(function(a, b) {
        return a - b;
      });
    //console.log(animDateInterval);
    let pointInInterval = 0;

    //brush area
    const brush = brushX() // brush rectangle area for mini chart
      .extent([
        [0, 0],
        [temporalbar_w, temporalbar_h],
      ]) // brush region from top left corner 0, 0 to 900, 40
      .on("start", brushStart)
      .on("end", brushEnd);

    //make group root of svg for transformation purpose
    let svgGroup = svg
      .append("g")
      .attr("id", "temporalbar-svgGroup")
      .attr("transform", "translate(" + margin.left + "," + 5 + ")");

    //axis group
    svgGroup
      .append("g")
      .attr("class", "temporal-axis axis--x")
      .attr("transform", "translate(" + 0 + "," + temporalbar_h + ")")
      .call(axis_x);
    svgGroup
      .append("g")
      .attr("class", "temporal-axis axis--y")
      .call(axis_y);

    //make bar chart group and draw chart on it
    let stackedGroups = svgGroup
      .append("g")
      .attr("id", "barchartGroup")
      .selectAll(".temporal-bar-group")
      .data(chartDataArr)
      .enter()
      .append("g")
      .attr("class", "temporal-bar-group");

    let stackedBars = stackedGroups
      .selectAll(".temporal-bar-rectangle")
      .data((d) => d[1])
      .enter()
      .append("rect")
      .attr("class", "temporal-bar-rectangle")
      .attr("y", (e, i) => scale_y(i + 1))
      .attr("height", barHeight)
      .attr("stroke", "black")
      .attr("stroke-width", "0.5")
      .style("opacity", 1)
      // .attr("fill", (e) => {
      //   let obj = props.isolateData.get(e.isolate_name);
      //   let col = getColorScaleByObject(obj, props.colorScale);
      //   return col;
      // });


    if (scaleMode === "daily") {
      stackedBars
        .attr("x", (e) => {
          let day = moment(e.isolate_colDate);
          let day_begin = day.startOf("day").toString();
          return scale_x(new Date(day_begin));
        })
        .attr("width", (e) => {
          let day = moment(e.isolate_colDate);
          let day_begin = day.startOf("day").toString();
          let day_end = day.endOf("day").toString();
          return scale_x(new Date(day_end)) - scale_x(new Date(day_begin));
        })
        .append("title")
        .text((e) => `${e.isolate_name}`);
    } else {
      stackedBars
        .attr("x", (e) => {
          let day = moment(e.isolate_colDate);
          let isoWk_begin = day.startOf("isoWeek").toString();
          return scale_x(new Date(isoWk_begin));
        })
        .attr("width", (e) => {
          let day = moment(e.isolate_colDate);
          let isoWk_begin = day.startOf("isoWeek").toString();
          let isoWk_end = day.endOf("isoWeek").toString();
          return scale_x(new Date(isoWk_end)) - scale_x(new Date(isoWk_begin));
        })
        .append("title")
        .text((e) => `${e.isolate_name}`);
    }

    //make brush group
    let brushAreaGroup = svgGroup
      .append("g")
      .attr("class", "temporal-brushArea")
      .call(brush);


    function brushStart() {
      if (currentEvent.sourceEvent !== null && animIsPlaying.current) {
        animPlayer.current.forEach(clearInterval);
        pointInInterval = 0;
        animIsPlaying.current = false;
      }
    }


    function brushEnd() {
      //when brush is end, do logic here (e.g., filter data)
      let selection = currentEvent.selection;
      if (selection !== null) {
        let dateSelection = selection.map(scale_x.invert);
        svgGroup.selectAll(".temporal-bar-rectangle").style("opacity", (d) => {
          let day = moment(d.isolate_colDate);
          if (day >= dateSelection[0] && day <= dateSelection[1]) {
            return 1;
          } else {
            return 0.2;
          }
        });
        let selectedData = Array.from(props.isolateData.values())
          .map((d) => d)
          .filter(
            (d) =>
              d.isolate_colDate >= dateSelection[0] &&
              d.isolate_colDate <= dateSelection[1]
          );
        if (selectedData && selectedData.length > 0) {
          selectedData = selectedData.map((d) => d.uid);
          props.setSelectedData(selectedData);
        }

        setselectionDate(dateSelection);
      }
    }

    // ======================= ANIMATION CONTROLLER ================================
    const cont = select(temporalbarContainerRef.current);
    cont.select("#playBtn").on("click", () => {
      if (!animIsPlaying.current) {
        playAnimation();
      } else {
        pauseAnimation();
      }
    });

    cont.select("#stopBtn").on("click", () => {
      if (animIsPlaying.current) {
        stopAnimation();
      }
    });

    function playAnimation() {
      let animPlayer_interval = setInterval(function() {
        movingBrush();
      }, 1000);
      animPlayer.current.push(animPlayer_interval);
      animIsPlaying.current = true;
    }

    function pauseAnimation() {
      animPlayer.current.forEach(clearInterval);
      animIsPlaying.current = false;
    }

    function movingBrush() {
      if (animIsPlaying.current && pointInInterval < animDateInterval.length) {
        var currentDate =
          pointInInterval === animDateInterval.length - 1
            ? moment(animDateInterval[pointInInterval]).add(1, "day")
            : animDateInterval[pointInInterval];
        brushAreaGroup.call(brush).call(brush.move, [0, scale_x(currentDate)]);
        pointInInterval += 1;
      } else {
        stopAnimation();
      }
    }

    function stopAnimation() {
      animPlayer.current.forEach(clearInterval);
      pointInInterval = 0;
      animIsPlaying.current = false;
      brushAreaGroup.call(brush.move, scale_x.range());
    }

    brushAreaGroup.call(brush.move, scale_x.range());
  }

  function updateBySelectedData() {
    svg.selectAll(".temporal-bar-rectangle").style("opacity", (d) => {
      if (props.selectedData.indexOf(d.uid) !== -1) {
        return 1;
      } else {
        return 0.2;
      }
    });
  }

  function clearSelectedData() {
    svg.selectAll(".temporal-bar-rectangle").style("opacity", 1);
  }

  return (
    <React.Fragment>
      <div id="temporalbarContainer" ref={temporalbarContainerRef}>
        <div id="temporalbar-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="temporalbar-buttons-container">
          <div id="temporalbar-playback">
            <Button
              id={"playBtn"}
              size={"medium"}
              style={{ margin: "0px", border: "none" }}
              icon={<PlayCircleOutlined />}
            ></Button>
            <Button
              id={"stopBtn"}
              size={"small"}
              style={{ margin: "0px", border: "none" }}
              icon={<BorderOutlined />}
            ></Button>
          </div>

          <div id="temporalbar-selectedDate">
            <p style={{ marginLeft: "10px" }}>
              <strong>Selected date: </strong>
              <span id="selection-date-text"></span>
            </p>
          </div>
        </div>
        <svg id="temporalbar-svg" ref={temporalbarSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default TemporalStackedBar;
