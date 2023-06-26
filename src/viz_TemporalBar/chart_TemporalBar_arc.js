/* ============================================================================
PROBLEM: D3 brush currentEvent state is interfered by ract grid layout postion
So we can only use gid 0,0 and make it non resizeable
============================================================================ */
import React, { useEffect, useRef, useState } from "react";
import { extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { select } from "d3-selection";
import { brushX } from "d3-brush";
import { scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { event as currentEvent } from "d3";
import "./style_TemporalBar.css";

const moment = require("moment");

const TemporalBarChart = (props) => {
  //states
  const [selectionDate, setselectionDate] = useState(null);
  const temporalbarSVGRef = useRef();
  const temporalbarContainerRef = useRef();
  const observedWidth = props.width ? props.width - 10 : 0;
  const observedHeight = props.height ? props.height - 100 : 0; //ofsett by card head
  //console.log(props);

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

  useEffect(() => {
    if (observedWidth && observedHeight && props.data) {
      const svg = select(temporalbarSVGRef.current);
      const container_w = observedWidth;
      const container_h = observedHeight;
      const margin = { top: 10, right: 20, bottom: 10, left: 30 };
      const temporalbar_w = container_w - margin.left - margin.right;
      const temporalbar_h = container_h - margin.top - margin.bottom - 10;
      //console.log(currentEvent);

      //set svg attributes
      svg
        .attr("width", temporalbar_w + margin.left + margin.right)
        .attr("height", temporalbar_h + margin.top + margin.bottom);

      //clean previous drawing artifacts
      select("#temporalbar-svgGroup").remove();

      //draw it
      draw();

      //draw function: heavy processes like drawing each data points are here
      function draw() {
        const chartData = props.data;
        const dateRange = extent(
          chartData.map((d) => {
            return d.date_id;
          })
        );

        const frequencyRange = extent(
          chartData.map((d) => {
            return d.date_freq;
          })
        );

        //scale
        const scale_x = scaleTime()
          .domain([
            moment(dateRange[0]).subtract(1, "weeks"),
            moment(dateRange[1]).add(1, "weeks"),
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
        svgGroup
          .append("g")
          .attr("id", "barchartGroup")
          .selectAll(".temporal-bar-rectangle")
          .data(chartData)
          .enter()
          .append("rect")
          .attr("class", "temporal-bar-rectangle")
          .attr("x", (d) => {
            let day = moment(d.date_id);
            let day_begin = day.startOf("day").toString();
            return scale_x(new Date(day_begin));
          })
          .attr("y", (d) => {
            return scale_y(d.date_freq);
          })
          .attr("width", (d) => {
            let day = moment(d.date_id);
            let day_begin = day.startOf("day").toString();
            let day_end = day.endOf("day").toString();
            return scale_x(new Date(day_end)) - scale_x(new Date(day_begin));
          })
          .attr("height", (d) => {
            return temporalbar_h - scale_y(d.date_freq);
          })
          .attr("stroke", "black")
          .style("fill", "none");

        //make brush group
        let brushAreaGroup = svgGroup
          .append("g")
          .attr("class", "temporal-brushArea")
          .call(brush);

        let brushResizePath = function(d) {
          let e = +(d.type === "e"),
            x = e ? 1 : -1,
            y = temporalbar_h / 6;
          return (
            "M" +
            0.5 * x +
            "," +
            y +
            "A6,6 0 0 " +
            e +
            " " +
            6.5 * x +
            "," +
            (y + 6) +
            "V" +
            (2 * y - 6) +
            "A6,6 0 0 " +
            e +
            " " +
            0.5 * x +
            "," +
            2 * y +
            "Z" +
            "M" +
            2.5 * x +
            "," +
            (y + 8) +
            "V" +
            (2 * y - 8) +
            "M" +
            4.5 * x +
            "," +
            (y + 8) +
            "V" +
            (2 * y - 8)
          );
        };

        function brushHandle(g, selection) {
          g.selectAll(".handle--custom")
            .data([{ type: "w" }, { type: "e" }])
            .join((enter) =>
              enter
                .append("path")
                .attr("class", "handle--custom")
                .attr("fill", "#666")
                .attr("fill-opacity", 0)
                .attr("stroke", "#000")
                .attr("stroke-width", 1.5)
                .attr("cursor", "ew-resize")
                .attr("d", brushResizePath)
            )
            .attr(
              "transform",
              selection.length === 0
                ? null
                : (d, i) => `translate(${selection[i]},${temporalbar_h / 4})`
            );
        }

        function brushStart() {
          //hide handle
          let selection = currentEvent.selection;
          if (selection[0] - selection[1] === 0) {
            brushAreaGroup.selectAll(".handle--custom").attr("display", "none");
          }
        }

        function brushed() {
          //move handle and highlight selected bar
          brushAreaGroup.selectAll(".handle--custom").attr("display", "true");
          let selection = currentEvent.selection;

          select(this).call(brushHandle, selection); //move brush handle based on selection
        }

        function brushEnd() {
          //when brush is end, do logic here (e.g., filter data)
          let selection = currentEvent.selection;
          if (selection !== null) {
            let dateSelection = selection.map(scale_x.invert);
            svgGroup
              .selectAll(".temporal-bar-rectangle")
              .attr("stroke", function(d) {
                let day = moment(d.date_id);
                if (day > dateSelection[0] && day < dateSelection[1]) {
                  return "red";
                } else {
                  return "black";
                }
              });
            let selectedData = props.isolateData
              .map((d) => d)
              .filter(
                (d) =>
                  d.isolate_colDate > dateSelection[0] &&
                  d.isolate_colDate < dateSelection[1]
              );
            if (selectedData && selectedData.length > 0) {
              selectedData = selectedData.map((d) => d.uid);
            }
            props.setSelectedData(selectedData);
            setselectionDate(dateSelection);
          }
        }

        brushAreaGroup.call(brush.move, scale_x.range());
      }
    }
  }, [props.data, observedWidth, observedHeight]);

  return (
    <React.Fragment>
      <div id="temporalbarContainer" ref={temporalbarContainerRef}>
        <p style={{ marginLeft: "10px" }}>
          <strong>Selected date: </strong>
          <span id="selection-date-text"></span>
        </p>
        <svg id="temporalbar-svg" ref={temporalbarSVGRef}></svg>
      </div>
    </React.Fragment>
  );
};

export default TemporalBarChart;
