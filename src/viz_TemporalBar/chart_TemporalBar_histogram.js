/* ============================================================================
PROBLEM: D3 brush currentEvent state is interfered by ract grid layout postion
So we can only use gid 0,0 and make it non resizeable
============================================================================ */
import React, { useEffect, useRef, useState } from "react";
import { extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { select } from "d3-selection";
import { Empty } from "antd";
import { brushX } from "d3-brush";
import { scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { event as currentEvent } from "d3";
import { filterUnique } from "../utils/utils";
import "./style_TemporalBar.css";

const moment = require("moment");

const TemporalHistogram = (props) => {
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

  //USEEFFECTS
  useEffect(() => {
    //console.log(isUserStartResize, props.isUserRedraw);
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
    if (props.selectedData && props.selectedData.length === 0) {
      clearSelectedData();
    }
  }, [props.selectedData]);

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
      .on("brush", brushed)
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
    let barGroup = svgGroup.append("g").attr("id", "barchartGroup");
    let bars = barGroup
      .selectAll(".temporal-bar-rectangle")
      .data(chartDataArr)
      .enter()
      .append("rect")
      .attr("class", "temporal-bar-rectangle")
      .attr("x", (d) => {
        let day = moment(d[0]);
        let day_begin = day.startOf("day").toString();
        return scale_x(new Date(day_begin));
      })
      .attr("y", (d) => {
        return scale_y(d[1].length);
      })
      .attr("height", (d) => {
        return temporalbar_h - scale_y(d[1].length);
      })
      .attr("stroke", "black")
      .style("fill", "none");

    if (scaleMode === "daily") {
      bars.attr("width", (d) => {
        let day = moment(d[0]);
        let day_begin = day.startOf("day").toString();
        let day_end = day.endOf("day").toString();
        return scale_x(new Date(day_end)) - scale_x(new Date(day_begin));
      });
    } else {
      bars.attr("width", (d) => {
        let day = moment(d[0]);
        let day_begin = day.startOf("isoWeek").toString();
        let day_end = day.endOf("isoWeek").toString();
        return scale_x(new Date(day_end)) - scale_x(new Date(day_begin));
      });
    }

    //make brush group
    let brushAreaGroup = svgGroup
      .append("g")
      .attr("class", "temporal-brushArea")
      .call(brush);

    // function brushHandle(g, selection) {
    //   g.selectAll(".handle--custom")
    //     .data([{ type: "w" }, { type: "e" }])
    //     .join(enter =>
    //       enter
    //         .append("path")
    //         .attr("class", "handle--custom")
    //         .attr("fill", "#666")
    //         .attr("fill-opacity", 0)
    //         .attr("stroke", "#000")
    //         .attr("stroke-width", 1.5)
    //         .attr("cursor", "ew-resize")
    //         .attr("d", d => brushResizePath(d, temporalbar_h))
    //     )
    //     .attr(
    //       "transform",
    //       selection.length === 0
    //         ? null
    //         : (d, i) => `translate(${selection[i]},${temporalbar_h / 4})`
    //     );
    // }

    function brushStart() {
      //hide handle
      if (currentEvent.sourceEvent !== null && animIsPlaying.current) {
        animPlayer.current.forEach(clearInterval);
        pointInInterval = 0;
        animIsPlaying.current = false;
      }
      // let selection = currentEvent.selection;
      // if (selection[0] - selection[1] === 0) {
      //   brushAreaGroup.selectAll(".handle--custom").attr("display", "none");
      // }
    }

    function brushed() {
      //move handle and highlight selected bar
      //brushAreaGroup.selectAll(".handle--custom").attr("display", "true");
      //let selection = currentEvent.selection;
      //select(this).call(brushHandle, selection); //move brush handle based on selection
    }

    function brushEnd() {
      //when brush is end, do logic here (e.g., filter data)
      let selection = currentEvent.selection;
      if (selection !== null) {
        let dateSelection = selection.map(scale_x.invert);
        svgGroup
          .selectAll(".temporal-bar-rectangle")
          .attr("stroke", function(d) {
            let day = moment(d[0]);
            if (day >= dateSelection[0] && day <= dateSelection[1]) {
              return "red";
            } else {
              return "black";
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
          selectedData = selectedData.map((d) => d.isolate_name);
          props.setSelectedData(selectedData);
        }

        setselectionDate(dateSelection);
      }
    }

    // ======================= ANIMATION CONTROLLER ================================
    const cont = select(temporalbarContainerRef.current);
    cont.select("#playBtn").on("click", () => {
      if (!animIsPlaying.current) {
        //jika animasi tidak saat dijalankan = FALSE
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

    //when animation is playing never make new set interval

    function playAnimation() {
      let animPlayer_interval = setInterval(function() {
        movingBrush();
      }, 1000);
      animPlayer.current.push(animPlayer_interval);
      //set animation is playing = TRUE
      //change the state on anim is playing
      //props.changeTempIsAnimationPlaying(true);
      animIsPlaying.current = true;
    }

    function pauseAnimation() {
      animPlayer.current.forEach(clearInterval);
      //props.changeTempIsAnimationPlaying(false);
      animIsPlaying.current = false;
    }

    function movingBrush() {
      //console.log("moving");
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
      //props.changeTempIsAnimationPlaying(false);
      animIsPlaying.current = false;
      //console.log(scale_x.range());
      brushAreaGroup.call(brush.move, scale_x.range());
    }

    brushAreaGroup.call(brush.move, scale_x.range());
  }

  function clearSelectedData() {
    svg.selectAll(".temporal-bar-rectangle").attr("stroke", "black");
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

export default TemporalHistogram;
/*
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
*/
